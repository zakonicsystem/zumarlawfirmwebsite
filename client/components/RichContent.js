"use client";

import { useMemo } from "react";

const allowedStyles = new Set(["color", "font-size", "font-style", "font-weight", "text-decoration"]);
const blockTagPattern = /<(p|div|h[1-6]|ul|ol|li|blockquote)\b/i;
const inlineHeadingStyles = {
  h1: "font-size: 2.5rem; font-weight: 900; line-height: 1.12",
  h2: "font-size: 2rem; font-weight: 900; line-height: 1.12",
  h3: "font-size: 1.5rem; font-weight: 900; line-height: 1.12",
  h4: "font-size: 1.125rem; font-weight: 900; line-height: 1.12",
  h5: "font-size: 1.125rem; font-weight: 900; line-height: 1.12",
  h6: "font-size: 1.125rem; font-weight: 900; line-height: 1.12"
};

function decodeHtmlEntities(content) {
  let html = String(content || "");

  if (!/&(?:lt|gt|amp|quot|#39);/i.test(html)) {
    return html;
  }

  if (typeof document === "undefined") {
    for (let index = 0; index < 3; index += 1) {
      const decoded = html
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, "\"")
        .replace(/&#39;/gi, "'")
        .replace(/&amp;/gi, "&");

      if (decoded === html) {
        break;
      }
      html = decoded;
    }

    return html;
  }

  const textarea = document.createElement("textarea");
  for (let index = 0; index < 3; index += 1) {
    textarea.innerHTML = html;
    const decoded = textarea.value;
    if (decoded === html) {
      break;
    }
    html = decoded;
  }

  return textarea.value;
}

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
  let html = decodeHtmlEntities(content);

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

  html = html.replace(/<span\b([^>]*)>/gi, (_match, attributes) => {
    const styleMatch = attributes.match(/\sstyle\s*=\s*(["'])(.*?)\1/i);
    if (!styleMatch) {
      return "<span>";
    }

    const cleanStyle = normalizeStyle(styleMatch[2]);
    return cleanStyle ? `<span style="${cleanStyle}">` : "<span>";
  });
  html = html.replace(/<(\w+)\b([^>]*)>\s*<\/\1>/gi, "");

  return html.trim();
}

function inlineHtml(html) {
  return html
    .replace(/<(p|div|h[1-6]|blockquote)\b([^>]*)>/gi, (_match, tag, attributes) => `<span${inlineAttributes(tag, attributes)}>`)
    .replace(/<\/(p|div|h[1-6]|blockquote)>/gi, "</span>")
    .replace(/<\/?li\b[^>]*>/gi, " ")
    .replace(/<\/?(ul|ol)\b[^>]*>/gi, "")
    .trim();
}

function inlineAttributes(tag, attributes = "") {
  const defaultStyle = inlineHeadingStyles[String(tag || "").toLowerCase()];
  if (!defaultStyle) {
    return attributes;
  }

  const stylePattern = /\sstyle\s*=\s*(["'])(.*?)\1/i;
  if (stylePattern.test(attributes)) {
    return attributes.replace(stylePattern, (_match, quote, styleText) => {
      const cleanStyle = normalizeStyle(`${defaultStyle}; ${styleText}`);
      return cleanStyle ? ` style=${quote}${cleanStyle}${quote}` : "";
    });
  }

  return `${attributes} style="${defaultStyle}"`;
}

export default function RichContent({ content, className = "", as, inline = false }) {
  const html = useMemo(() => {
    const sanitized = sanitizeHtml(content);
    return inline ? inlineHtml(sanitized) : sanitized;
  }, [content, inline]);

  if (!html) return null;

  const Component = as || (!inline && blockTagPattern.test(html) ? "div" : "span");

  return (
    <Component
      className={`rich-content break-words ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning
    />
  );
}
