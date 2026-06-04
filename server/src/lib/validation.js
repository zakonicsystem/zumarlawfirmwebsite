const collectionMap = {
  services: "services",
  blogs: "blogs",
  branches: "branches",
  "service-areas": "serviceAreas"
};

export function collectionKey(name) {
  return collectionMap[name] || null;
}

export function makeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeRecord(item, fallbackPrefix) {
  const title = clean(item.title || item.name);
  const slug = makeSlug(item.slug || title || `${fallbackPrefix}-${Date.now()}`);

  return {
    ...item,
    id: item.id || slug,
    slug
  };
}

export function normalizeFullCmsData(data) {
  const stamp = Date.now();

  return {
    ...data,
    branches: array(data.branches).map((item, index) => normalizeRecord(item, `branch-${stamp}-${index}`)),
    serviceAreas: array(data.serviceAreas).map((item, index) => normalizeRecord(item, `service-area-${stamp}-${index}`)),
    services: array(data.services).map((item, index) => normalizeRecord(item, `service-${stamp}-${index}`)),
    blogs: array(data.blogs).map((item, index) => normalizeRecord(item, `blog-${stamp}-${index}`))
  };
}

export function publicCmsData(data) {
  return {
    ...data,
    settings: {
      ...(data.settings || {}),
      updatedAt: data.settings?.updatedAt || null,
      adminEmail: undefined,
      adminPassword: undefined
    }
  };
}

function clean(value) {
  return String(value || "").trim();
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function cleanDetails(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, entry]) => [clean(key), clean(entry)])
      .filter(([key, entry]) => key && entry)
  );
}

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  throw error;
}
