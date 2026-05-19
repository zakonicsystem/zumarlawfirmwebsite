const collectionMap = {
  services: "services",
  blogs: "blogs",
  news: "news",
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

export function normalizeAppointment(payload, existing = {}) {
  const name = clean(payload.name);
  const phone = clean(payload.phone);

  if (!name) {
    validationError("Name is required.");
  }

  if (!phone) {
    validationError("Phone is required.");
  }

  return {
    id: existing.id || payload.id || `appointment-${Date.now()}`,
    name,
    phone,
    email: clean(payload.email),
    service: clean(payload.service),
    date: clean(payload.date),
    message: clean(payload.message),
    status: clean(payload.status) || existing.status || "New",
    createdAt: existing.createdAt || payload.createdAt || new Date().toISOString()
  };
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
    blogs: array(data.blogs).map((item, index) => normalizeRecord(item, `blog-${stamp}-${index}`)),
    news: array(data.news).map((item, index) => normalizeRecord(item, `news-${stamp}-${index}`)),
    appointments: array(data.appointments).map((item) => normalizeAppointment({ ...item, name: item.name || "Unknown", phone: item.phone || "Unknown" }, item))
  };
}

export function publicCmsData(data) {
  return {
    ...data,
    settings: {
      updatedAt: data.settings?.updatedAt || null,
      adminEmail: undefined,
      adminPassword: undefined
    },
    appointments: undefined
  };
}

function clean(value) {
  return String(value || "").trim();
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  throw error;
}
