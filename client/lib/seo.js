import { readCmsData } from "./cmsStore";
import { defaultSeoPages } from "./seoDefaults";

export function buildMetadata(entry, fallback = {}) {
  const title = entry?.metaTitle || fallback.metaTitle || fallback.title;
  const description = entry?.metaDescription || fallback.metaDescription || fallback.description;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {})
  };
}

export async function getPageMetadata(key, fallback = {}) {
  const cms = await readCmsData();
  return buildMetadata(cms.seoPages?.[key], defaultSeoPages[key] || fallback);
}

export function getRecordMetadata(record, fallback = {}) {
  return buildMetadata(record, {
    metaTitle: record?.title || fallback.title,
    metaDescription: record?.summary || fallback.description
  });
}
