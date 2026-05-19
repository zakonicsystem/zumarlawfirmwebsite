import { NextResponse } from "next/server";
import { makeSlug } from "@/lib/cmsDefaults";
import { normalizeCmsData, readCmsData, writeCmsData } from "@/lib/cmsStore";

const backendUrl = process.env.BACKEND_API_URL;
const backendToken = process.env.BACKEND_ADMIN_TOKEN || process.env.ADMIN_TOKEN;

export async function GET(request) {
  if (backendUrl) {
    return proxyBackend("GET");
  }

  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  const data = await readCmsData();
  return NextResponse.json(data);
}

export async function PUT(request) {
  if (backendUrl) {
    const data = await request.json();
    return proxyBackend("PUT", JSON.stringify(normalizeIncomingData(data)));
  }

  const authError = await requireAdmin(request);
  if (authError) {
    return authError;
  }

  const data = await request.json();
  const normalized = normalizeIncomingData(data);
  const saved = await writeCmsData(normalized);
  return NextResponse.json(saved);
}

async function requireAdmin(request) {
  const header = request?.headers?.get("authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  const expected = process.env.ADMIN_TOKEN || "local-next-admin";

  if (token !== expected) {
    return NextResponse.json({ error: "Unauthorized admin request." }, { status: 401 });
  }

  return null;
}

async function proxyBackend(method, body) {
  const response = await fetch(`${backendUrl}/api/admin/content`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${backendToken || ""}`
    },
    body
  });

  const data = await response.json();
  return NextResponse.json(normalizeCmsData(data), { status: response.status });
}

function normalizeIncomingData(data) {
  const stamp = Date.now();

  return {
    ...data,
    categories: normalizeStringList(data.categories),
    branches: normalizeCollection(data.branches, "branch", stamp),
    serviceAreas: normalizeCollection(data.serviceAreas, "service-area", stamp),
    services: normalizeCollection(data.services, "service", stamp),
    blogs: normalizeCollection(data.blogs, "blog", stamp),
    news: normalizeCollection(data.news, "news", stamp),
    appointments: (data.appointments || []).map((item, index) => ({
      ...item,
      id: item.id || `appointment-${stamp}-${index}`,
      createdAt: item.createdAt || new Date().toISOString()
    }))
  };
}

function normalizeCollection(items = [], prefix, stamp) {
  const used = new Set();

  return (items || []).map((item, index) => {
    const record = normalizeRecord(item, `${prefix}-${stamp}-${index}`);
    const baseSlug = record.slug || `${prefix}-${stamp}-${index}`;
    let slug = baseSlug;
    let count = 2;

    while (used.has(slug)) {
      slug = `${baseSlug}-${count}`;
      count += 1;
    }

    used.add(slug);
    return { ...record, slug, id: record.id || slug };
  });
}

function normalizeRecord(item, fallback) {
  const slug = item.slug || makeSlug(item.title || item.name || fallback);
  return {
    ...item,
    id: item.id || slug,
    slug: makeSlug(slug)
  };
}

function normalizeStringList(items = []) {
  return [...new Set((items || []).map((item) => String(item || "").trim()).filter(Boolean))];
}
