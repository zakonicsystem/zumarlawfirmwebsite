export function plainText(value, fallback = "") {
  let decoded = String(value || "");

  for (let index = 0; index < 3; index += 1) {
    const next = decoded
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, "\"")
      .replace(/&#39;/gi, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">");

    if (next === decoded) {
      break;
    }

    decoded = next;
  }

  const text = decoded
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text || fallback;
}
