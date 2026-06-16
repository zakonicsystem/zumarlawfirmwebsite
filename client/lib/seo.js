import { readCmsData } from "./cmsStore";
import { defaultSeoPages } from "./seoDefaults";
import { plainText } from "./text";

const siteUrl = "https://zumarlawfirm.com";
const defaultImage = "/images/zumar-law-firm-logo.webp";

function absoluteUrl(path = "/") {
  try {
    return new URL(path || "/", siteUrl).toString();
  } catch {
    return siteUrl;
  }
}

function cleanMetaText(value) {
  return plainText(value || "");
}

export function buildMetadata(entry, fallback = {}) {
  const title = cleanMetaText(entry?.metaTitle || fallback.metaTitle || fallback.title);
  const description = cleanMetaText(entry?.metaDescription || fallback.metaDescription || fallback.description);
  const canonical = absoluteUrl(fallback.canonical || fallback.path || entry?.canonical || "/");
  const image = fallback.image || entry?.image || defaultImage;

  return {
    ...(title ? { title: { absolute: title } } : {}),
    ...(description ? { description } : {}),
    alternates: {
      canonical
    },
    openGraph: {
      type: fallback.openGraphType || "website",
      url: canonical,
      siteName: "Zumar Law Firm",
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      images: [
        {
          url: image,
          alt: title || "Zumar Law Firm"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      images: [image]
    }
  };
}

export async function getPageMetadata(key, fallback = {}) {
  const cms = await readCmsData();
  return buildMetadata(cms.seoPages?.[key], { ...(defaultSeoPages[key] || {}), ...fallback });
}

export function getRecordMetadata(record, fallback = {}) {
  return buildMetadata(record, {
    metaTitle: record?.title || fallback.title,
    metaDescription: record?.summary || fallback.description,
    path: fallback.path,
    canonical: fallback.canonical,
    image: fallback.image || record?.image,
    openGraphType: fallback.openGraphType
  });
}
