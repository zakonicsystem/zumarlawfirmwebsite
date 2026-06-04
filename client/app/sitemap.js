import { readCmsData } from "@/lib/cmsStore";

const siteUrl = "https://zumarlawfirm.com";

const staticRoutes = [
  "/",
  "/about",
  "/blog",
  "/branches",
  "/calculators",
  "/careers",
  "/ceo",
  "/contact",
  "/privacy-policy",
  "/refund-policy",
  "/service-areas",
  "/services",
  "/terms-and-conditions"
];

function entry(pathname, updatedAt) {
  const normalizedPath = pathname === "/" ? "" : pathname;

  return {
    url: `${siteUrl}${normalizedPath}`,
    lastModified: updatedAt ? new Date(updatedAt) : new Date(),
    changeFrequency: pathname === "/" ? "daily" : "weekly",
    priority: pathname === "/" ? 1 : pathname.split("/").length === 2 ? 0.8 : 0.6
  };
}

function enabled(items = []) {
  return items.filter((item) => item?.enabled !== false && item?.slug);
}

export default async function sitemap() {
  const data = await readCmsData();
  const updatedAt = data.settings?.updatedAt;

  return [
    ...staticRoutes.map((route) => entry(route, updatedAt)),
    ...enabled(data.services).map((service) => entry(`/services/${service.slug}`, updatedAt)),
    ...enabled(data.blogs).map((post) => entry(`/blog/${post.slug}`, post.updatedAt || post.date || updatedAt)),
    ...enabled(data.branches).map((branch) => entry(`/branches/${branch.slug}`, updatedAt)),
    ...enabled(data.serviceAreas).map((area) => entry(`/service-areas/${area.slug}`, updatedAt))
  ];
}
