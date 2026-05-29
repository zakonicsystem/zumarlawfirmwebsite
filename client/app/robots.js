export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/"]
    },
    sitemap: "https://zumarlawfirm.com/sitemap.xml",
    host: "https://zumarlawfirm.com"
  };
}
