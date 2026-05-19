import { promises as fs } from "fs";
import path from "path";
import { makeCmsDefaults } from "./cmsDefaults";
import { formatPrice } from "./services";

const dataDirectory = path.join(process.cwd(), "data");
const dataFile = path.join(dataDirectory, "cms-content.json");
const lahoreBranchImage = "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85";
const backendUrl = process.env.BACKEND_API_URL;
const backendToken = process.env.BACKEND_ADMIN_TOKEN || process.env.ADMIN_TOKEN;
const cmsFetchRevalidateSeconds = Number(process.env.CMS_FETCH_REVALIDATE_SECONDS || 60);

export function enrichService(service) {
  const requirements = Array.isArray(service.requirements)
    ? service.requirements
    : String(service.requirements || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

  const price = normalizePrice(service.price);

  return {
    ...service,
    price,
    requirements,
    formattedPrice: formatPrice(price)
  };
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
    services: Array.isArray(merged.services) ? merged.services.map(enrichService) : defaults.services.map(enrichService),
    blogs: Array.isArray(merged.blogs) ? merged.blogs : defaults.blogs,
    news: Array.isArray(merged.news) ? merged.news : defaults.news,
    appointments: Array.isArray(merged.appointments) ? merged.appointments : []
  };
}

function normalizeBranches(branches) {
  return branches.map((branch) => {
    const addressQuery = [branch.address, branch.name, "Pakistan"].filter(Boolean).join(" ");
    const normalizedBranch = {
      ...branch,
      googleMapUrl: branch.googleMapUrl || branch.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressQuery)}`
    };

    return branch.slug === "lahore"
      ? {
        ...normalizedBranch,
        image: lahoreBranchImage
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
