"use client";

import { useMemo } from "react";

const allowedStyles = new Set(["color", "font-size", "font-style", "font-weight", "text-decoration"]);

function normalizeStyle(styleText = "") {
  const styles = new Map();

  styleText.split(";").forEach((entry) => {
    const [rawProperty, ...rawValue] = entry.split(":");
    const property = rawProperty?.trim().toLowerCase();
    const value = rawValue.join(":").trim();

    if (!allowedStyles.has(property) || !value || /javascript:|expression\(/i.test(value)) {
      return;
    }

    styles.set(property, value);
  });

  return [...styles.entries()].map(([property, value]) => `${property}: ${value}`).join("; ");
}

function sanitizeHtml(content) {
  let html = String(content || "");

  html = html.replace(/<(script|style|iframe|object|embed|form|input|button|textarea|select)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  html = html.replace(/<\/?(script|style|iframe|object|embed|form|input|button|textarea|select)\b[^>]*>/gi, "");
  html = html.replace(/\s+on[a-z]+\s*=\s*(["']).*?\1/gi, "");
  html = html.replace(/\s+on[a-z]+\s*=\s*[^\s>]+/gi, "");
  html = html.replace(/\s+href\s*=\s*(["'])\s*javascript:.*?\1/gi, "");
  html = html.replace(/\s+src\s*=\s*(["'])\s*javascript:.*?\1/gi, "");

  html = html.replace(/\s+style\s*=\s*(["'])(.*?)\1/gi, (_match, quote, styleText) => {
    const cleanStyle = normalizeStyle(styleText);
    return cleanStyle ? ` style=${quote}${cleanStyle}${quote}` : "";
  });

  html = html.replace(/<span\b[^>]*>/gi, "");
  html = html.replace(/<\/span>/gi, "");
  html = html.replace(/<(\w+)\b([^>]*)>\s*<\/\1>/gi, "");

  return html.trim();
}

export default function RichContent({ content, className = "" }) {
  const html = useMemo(() => sanitizeHtml(content), [content]);

  if (!html) return null;

  return (
    <span
      className={`rich-content break-words ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning
    />
  );
}
