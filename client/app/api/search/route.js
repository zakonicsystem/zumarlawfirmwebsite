import { NextResponse } from "next/server";
import { readCmsData } from "@/lib/cmsStore";
import { plainText } from "@/lib/text";

const staticPages = [
  { title: "Home", href: "/", type: "Page", summary: "Zumar Law Firm homepage." },
  { title: "How We Work", href: "/#how-we-work", type: "Section", summary: "Step-by-step workflow used for Zumar Law Firm service requests." },
  { title: "Services", href: "/services", type: "Page", summary: "Browse legal, tax, corporate, and registration services." },
  { title: "Tax Calculators", href: "/calculators", type: "Page", summary: "Salary tax and business tax estimators." },
  { title: "Service Areas", href: "/service-areas", type: "Page", summary: "Focused tax, corporate, licensing, and compliance areas." },
  { title: "Branches", href: "/branches", type: "Page", summary: "Office locations and branch contact details." },
  { title: "Appointment", href: "/appointment", type: "Page", summary: "Book a consultation appointment." },
  { title: "Contact", href: "/contact", type: "Page", summary: "Contact Zumar Law Firm." },
  { title: "About Zumar Law Firm", href: "/about", type: "Page", summary: "Company overview, mission, values, and registrations." },
  { title: "CEO & History", href: "/ceo", type: "Page", summary: "Leadership and history of Zumar Law Firm." },
  { title: "Careers", href: "/careers", type: "Page", summary: "Careers and professional opportunities at Zumar Law Firm." },
  { title: "Blog", href: "/blog", type: "Page", summary: "Case notes and service guides from Zumar Law Firm." },
  { title: "Privacy Policy", href: "/privacy-policy", type: "Page", summary: "Privacy policy for Zumar Law Firm website users." },
  { title: "Refund Policy", href: "/refund-policy", type: "Page", summary: "Refund and service fee policy." },
  { title: "Terms and Conditions", href: "/terms-and-conditions", type: "Page", summary: "Website and service terms." }
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = normalize(searchParams.get("q"));
  const cms = await readCmsData();

  const items = [
    ...staticPages,
    ...cms.services.filter((item) => item.enabled !== false).map((item) => ({
      title: plainText(item.title, "Service"),
      href: `/services/${item.slug}`,
      type: plainText(item.category, "Service"),
      summary: plainText(item.summary),
      keywords: [plainText(item.category), plainText(item.serviceType), plainText(item.formattedPrice)].filter(Boolean).join(" ")
    })),
    ...cms.serviceAreas.filter((item) => item.enabled !== false).map((item) => ({
      title: plainText(item.title, "Service Area"),
      href: `/service-areas/${item.slug}`,
      type: "Service Area",
      summary: plainText(item.summary),
      keywords: plainText(item.icon)
    })),
    ...cms.branches.filter((item) => item.enabled !== false).map((item) => ({
      title: plainText(item.name, "Office"),
      href: `/branches/${item.slug}`,
      type: "Office",
      summary: plainText(item.address),
      keywords: [plainText(item.phone), plainText(item.email)].filter(Boolean).join(" ")
    })),
    ...cms.blogs.filter((item) => item.enabled !== false).map((item) => ({
      title: plainText(item.title, "Blog"),
      href: `/blog/${item.slug}`,
      type: "Blog",
      summary: plainText(item.summary),
      keywords: [plainText(item.service), plainText(item.date)].filter(Boolean).join(" ")
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
