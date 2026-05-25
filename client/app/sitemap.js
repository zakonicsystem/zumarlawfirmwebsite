import { readCmsData } from "@/lib/cmsStore";

const siteUrl = "https://zumarlawfirm.com";

const staticRoutes = [
  "",
  "/about",
  "/appointment",
  "/blog",
  "/branches",
  "/calculators",
  "/calculators/business-tax",
  "/calculators/salary-tax",
  "/careers",
  "/ceo",
  "/contact",
  "/faqs",
  "/news",
  "/privacy-policy",
  "/refund-policy",
  "/service-areas",
  "/services",
  "/team",
  "/terms-and-conditions"
];

function entry(pathname, updatedAt) {
  return {
    url: `${siteUrl}${pathname}`,
    lastModified: updatedAt ? new Date(updatedAt) : new Date()
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
    ...enabled(data.news).map((post) => entry(`/news/${post.slug}`, post.updatedAt || post.date || updatedAt)),
    ...enabled(data.branches).map((branch) => entry(`/branches/${branch.slug}`, updatedAt)),
    ...enabled(data.serviceAreas).map((area) => entry(`/service-areas/${area.slug}`, updatedAt))
  ];
}
