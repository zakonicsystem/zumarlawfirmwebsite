import { NextResponse } from "next/server";
import { readCmsData } from "@/lib/cmsStore";

const staticPages = [
  { title: "Home", href: "/", type: "Page", summary: "Zumar Law Firm homepage." },
  { title: "Services", href: "/services", type: "Page", summary: "Browse legal, tax, corporate, and registration services." },
  { title: "Tax Calculators", href: "/calculators", type: "Page", summary: "Salary tax and business tax estimators." },
  { title: "Salary Tax Calculator", href: "/calculators/salary-tax", type: "Calculator", summary: "Estimate salaried income tax." },
  { title: "Business Tax Calculator", href: "/calculators/business-tax", type: "Calculator", summary: "Estimate individual or AOP business income tax." },
  { title: "Service Areas", href: "/service-areas", type: "Page", summary: "Focused tax, corporate, licensing, and compliance areas." },
  { title: "Branches", href: "/branches", type: "Page", summary: "Office locations and branch contact details." },
  { title: "Appointment", href: "/appointment", type: "Page", summary: "Book a consultation appointment." },
  { title: "Contact", href: "/contact", type: "Page", summary: "Contact Zumar Law Firm." },
  { title: "CEO & History", href: "/ceo", type: "Page", summary: "Leadership and history of Zumar Law Firm." },
  { title: "Careers", href: "/careers", type: "Page", summary: "Careers and professional opportunities at Zumar Law Firm." },
  { title: "Blog", href: "/blog", type: "Page", summary: "Case notes and service guides from Zumar Law Firm." },
  { title: "Contact", href: "/contact", type: "Page", summary: "Send your inquiry to the team." }
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = normalize(searchParams.get("q"));
  const cms = await readCmsData();

  const items = [
    ...staticPages,
    ...cms.services.filter((item) => item.enabled !== false).map((item) => ({
      title: item.title,
      href: `/services/${item.slug}`,
      type: item.category || "Service",
      summary: item.summary || "",
      keywords: [item.category, item.serviceType, item.formattedPrice].filter(Boolean).join(" ")
    })),
    ...cms.serviceAreas.filter((item) => item.enabled !== false).map((item) => ({
      title: item.title,
      href: `/service-areas/${item.slug}`,
      type: "Service Area",
      summary: item.summary || "",
      keywords: item.icon || ""
    })),
    ...cms.branches.filter((item) => item.enabled !== false).map((item) => ({
      title: item.name,
      href: `/branches/${item.slug}`,
      type: "Office",
      summary: item.address || "",
      keywords: [item.phone, item.email].filter(Boolean).join(" ")
    })),
    ...cms.news.filter((item) => item.enabled !== false).map((item) => ({
      title: item.title,
      href: `/news/${item.slug}`,
      type: "News",
      summary: item.summary || "",
      keywords: [item.authority, item.date].filter(Boolean).join(" ")
    })),
    ...cms.blogs.filter((item) => item.enabled !== false).map((item) => ({
      title: item.title,
      href: `/blog/${item.slug}`,
      type: "Blog",
      summary: item.summary || "",
      keywords: [item.service, item.date].filter(Boolean).join(" ")
    }))
  ];

  const results = query
    ? items
      .map((item) => ({ ...item, score: scoreItem(item, query) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
    : items.slice(0, 8);

  return NextResponse.json({ results });
}

function scoreItem(item, query) {
  const haystack = normalize(`${item.title} ${item.type} ${item.summary} ${item.keywords || ""}`);
  const words = query.split(" ").filter(Boolean);
  let score = 0;

  if (normalize(item.title).includes(query)) {
    score += 5;
  }

  for (const word of words) {
    if (haystack.includes(word)) {
      score += 1;
    }
  }

  return score;
}

function normalize(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
