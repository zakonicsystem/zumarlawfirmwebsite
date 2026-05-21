import { promises as fs } from "fs";
import path from "path";
import { makeCmsDefaults } from "./cmsDefaults";
import { formatPrice, getServiceTimeline } from "./services";
import { serviceData } from "./serviceSchemas";

const dataDirectory = path.join(process.cwd(), "data");
const dataFile = path.join(dataDirectory, "cms-content.json");
const branchImages = {
  lahore: "/images/Lahore%20Branch.webp",
  "rawalpindi-islamabad": "/images/Islamabad%20Branch.webp"
};
const branchMapUrls = {
  lahore: "https://www.google.com/maps/place/Zumar+Law+Firm/@31.5545954,74.3028964,676m/data=!3m3!1e3!4b1!5s0x3919035239402f37:0xab082b65398f26be!4m6!3m5!1s0x3919019c399b3c3f:0x8386d63b401f100a!8m2!3d31.5545909!4d74.3054713!16s%2Fg%2F11l1f488xq?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D",
  "rawalpindi-islamabad": "https://www.google.com/maps/place/ZUMAR+LAW+FIRM+ISLAMABAD/@33.5951302,73.0370388,2643m/data=!3m2!1e3!4b1!4m6!3m5!1s0x38df95720e9437fb:0xab6d1a24fef97ef1!8m2!3d33.5951137!4d73.0554928!16s%2Fg%2F11zj82y2kg?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D"
};
const backendUrl = process.env.BACKEND_API_URL;
const backendToken = process.env.BACKEND_ADMIN_TOKEN || process.env.ADMIN_TOKEN;
const cmsFetchRevalidateSeconds = Number(process.env.CMS_FETCH_REVALIDATE_SECONDS || 60);

export function enrichService(service) {
  const schemaFields = serviceData.fields?.[service.title] || [];
  const requirements = shouldUseSchemaServiceData(service.title)
    ? schemaFields.map((field) => field.label).filter(Boolean)
    : Array.isArray(service.requirements)
      ? service.requirements
      : String(service.requirements || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

  const schemaPrice = serviceData.prices?.[service.title];
  const price = normalizePrice(shouldUseSchemaPrice(service.title, schemaPrice) ? schemaPrice : service.price);

  return {
    ...service,
    price,
    requirements,
    fields: shouldUseSchemaServiceData(service.title) ? schemaFields : Array.isArray(service.fields) && service.fields.length > 0 ? service.fields : schemaFields,
    timeline: service.timeline || getServiceTimeline(service.title, service.category),
    formattedPrice: formatPrice(price)
  };
}

function shouldUseSchemaPrice(title, price) {
  return price !== undefined && shouldUseSchemaServiceData(title);
}

function shouldUseSchemaServiceData(title) {
  return /^OEP License$|^DNFBP License -/.test(String(title || ""));
}

function normalizePrice(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "number") {
    return value;
  }

  const text = String(value || "").trim();
  if (!text) {
    return "";
  }

  if (/[$£€]|AUD|CAD|USD|GBP/i.test(text)) {
    return text;
  }

  if (text.includes("-")) {
    const parts = text
      .split("-")
      .map((part) => Number(part.replace(/[^0-9]/g, "")))
      .filter(Boolean);

    return parts.length === 2 ? parts : text;
  }

  const number = Number(text.replace(/[^0-9]/g, ""));
  return number || text;
}

export async function readCmsData() {
  if (backendUrl) {
    return readBackendCmsData();
  }

  await fs.mkdir(dataDirectory, { recursive: true });

  try {
    const raw = await fs.readFile(dataFile, "utf8");
    return normalizeCmsData(JSON.parse(raw));
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }

    const defaults = makeCmsDefaults();
    await writeCmsData(defaults);
    return normalizeCmsData(defaults);
  }
}

export async function writeCmsData(data) {
  if (backendUrl) {
    return writeBackendCmsData(data);
  }

  const normalized = normalizeCmsData(data);
  normalized.settings = {
    ...(normalized.settings || {}),
    updatedAt: new Date().toISOString()
  };
  await fs.mkdir(dataDirectory, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(normalized, null, 2), "utf8");
  return normalized;
}

async function readBackendCmsData() {
  const response = await fetch(`${backendUrl}/api/content`, {
    next: { revalidate: cmsFetchRevalidateSeconds }
  });

  if (!response.ok) {
    throw new Error(`Backend CMS read failed with status ${response.status}.`);
  }

  return normalizeCmsData(await response.json());
}

async function writeBackendCmsData(data) {
  const response = await fetch(`${backendUrl}/api/admin/content`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${backendToken || ""}`
    },
    body: JSON.stringify(data),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Backend CMS write failed with status ${response.status}.`);
  }

  return normalizeCmsData(await response.json());
}

export function normalizeCmsData(data) {
  const defaults = makeCmsDefaults();
  const mergedHomeContent = mergeHomeContent(defaults.homeContent, data?.homeContent);
  const merged = {
    ...defaults,
    ...(data || {}),
    settings: { ...defaults.settings, ...(data?.settings || {}) },
    seoPages: mergeSeoPages(defaults.seoPages, data?.seoPages),
    pageContent: mergePageContent(defaults.pageContent, data?.pageContent),
    homeContent: mergedHomeContent,
    about: {
      ...defaults.about,
      ...(data?.about || {}),
      sharedProcess: {
        ...mergedHomeContent.sharedProcess,
        ...(data?.about?.sharedProcess || {})
      }
    }
  };

  return {
    ...merged,
    homeSections: Array.isArray(merged.homeSections) ? merged.homeSections : defaults.homeSections,
    heroSlides: Array.isArray(merged.heroSlides) ? merged.heroSlides : defaults.heroSlides,
    homeStats: Array.isArray(merged.homeStats) ? merged.homeStats : defaults.homeStats,
    homeContent: merged.homeContent,
    branches: normalizeBranches(Array.isArray(merged.branches) ? merged.branches : defaults.branches),
    serviceAreas: Array.isArray(merged.serviceAreas) ? merged.serviceAreas : defaults.serviceAreas,
    services: mergeServices(defaults.services, merged.services).map(enrichService),
    blogs: Array.isArray(merged.blogs) ? merged.blogs : defaults.blogs,
    news: Array.isArray(merged.news) ? merged.news : defaults.news,
    appointments: Array.isArray(merged.appointments) ? merged.appointments : []
  };
}

function mergeServices(defaultServices, services) {
  if (!Array.isArray(services)) {
    return defaultServices;
  }

  return services;
}

function normalizeBranches(branches) {
  return branches.map((branch) => {
    const addressQuery = [branch.address, branch.name, "Pakistan"].filter(Boolean).join(" ");
    const normalizedBranch = {
      ...branch,
      googleMapUrl: branchMapUrls[branch.slug] || branch.googleMapUrl || branch.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressQuery)}`
    };

    return branchImages[branch.slug]
      ? {
        ...normalizedBranch,
        image: branchImages[branch.slug]
      }
      : normalizedBranch;
  });
}

function mergePageContent(defaults, pages = {}) {
  return Object.fromEntries(
    Object.entries(defaults).map(([key, value]) => [
      key,
      {
        ...value,
        ...(pages?.[key] || {})
      }
    ])
  );
}

function mergeSeoPages(defaults, pages = {}) {
  return Object.fromEntries(
    Object.entries(defaults).map(([key, value]) => [
      key,
      {
        ...value,
        ...(pages?.[key] || {})
      }
    ])
  );
}

function mergeHomeContent(defaults, content = {}) {
  return {
    ...defaults,
    ...(content || {}),
    whyChoose: {
      ...defaults.whyChoose,
      ...(content?.whyChoose || {}),
      strengths: Array.isArray(content?.whyChoose?.strengths) ? content.whyChoose.strengths : defaults.whyChoose.strengths,
      benefits: Array.isArray(content?.whyChoose?.benefits) ? content.whyChoose.benefits : defaults.whyChoose.benefits
    },
    sharedProcess: {
      ...defaults.sharedProcess,
      ...(content?.sharedProcess || {}),
      steps: Array.isArray(content?.sharedProcess?.steps)
        ? content.sharedProcess.steps
        : Array.isArray(content?.processSteps)
          ? content.processSteps
          : defaults.sharedProcess.steps
    },
    processSteps: Array.isArray(content?.processSteps) ? content.processSteps : defaults.processSteps,
    serviceAreas: { ...defaults.serviceAreas, ...(content?.serviceAreas || {}) },
    testimonials: {
      ...defaults.testimonials,
      ...(content?.testimonials || {}),
      items: Array.isArray(content?.testimonials?.items) ? content.testimonials.items : defaults.testimonials.items
    },
    updates: { ...defaults.updates, ...(content?.updates || {}) },
    branches: { ...defaults.branches, ...(content?.branches || {}) }
  };
}

export function findBySlug(items, slug) {
  const normalized = decodeURIComponent(String(slug || "")).trim().toLowerCase();
  return items.find((item) => String(item.slug || "").toLowerCase() === normalized && item.enabled !== false);
}
