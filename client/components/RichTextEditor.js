"use client";

import { useEffect, useRef, useState } from "react";
import FaIcon from "@/components/FaIcon";

const fontSizeOptions = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "40px"];
const colorOptions = [
  ["#2B2D31", "Ink"],
  ["#5C264F", "Primary"],
  ["#F4AB3C", "Gold"],
  ["#6f6670", "Muted"],
  ["#000000", "Black"],
  ["#b91c1c", "Red"],
  ["#ffffff", "white"],
  ["#15803d", "Green"]
];

const allowedTags = new Set(["A", "B", "BLOCKQUOTE", "BR", "DIV", "EM", "H1", "H2", "H3", "H4", "H5", "H6", "I", "LI", "OL", "P", "SPAN", "STRONG", "U", "UL"]);
const allowedStyles = new Set(["color", "font-size", "font-style", "font-weight", "text-decoration"]);
const styleMap = {
  color: "color",
  fontSize: "font-size",
  fontStyle: "font-style",
  fontWeight: "font-weight",
  textDecoration: "text-decoration"
};

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

function removeStyleProperty(root, property) {
  const cssProperty = styleMap[property] || property;
  const elements = root.querySelectorAll ? root.querySelectorAll("[style]") : [];

  elements.forEach((element) => {
    element.style.removeProperty(cssProperty);
    const cleanStyle = normalizeStyle(element.getAttribute("style") || "");

    if (cleanStyle) {
      element.setAttribute("style", cleanStyle);
    } else {
      element.removeAttribute("style");
    }
  });
}

function normalizeElementStyle(element) {
  const cleanStyle = normalizeStyle(element.getAttribute("style") || "");

  if (cleanStyle) {
    element.setAttribute("style", cleanStyle);
  } else {
    element.removeAttribute("style");
  }
}

function unwrapNode(node) {
  const parent = node.parentNode;
  if (!parent) return;

  while (node.firstChild) {
    parent.insertBefore(node.firstChild, node);
  }

  parent.removeChild(node);
}

function cleanDom(root) {
  const elements = [...root.querySelectorAll("*")].reverse();

  elements.forEach((element) => {
    if (!allowedTags.has(element.tagName)) {
      unwrapNode(element);
      return;
    }

    [...element.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();

      if (name.startsWith("on")) {
        element.removeAttribute(attribute.name);
        return;
      }

      if (name === "href") {
        const href = attribute.value.trim();
        if (!/^(https?:|mailto:|tel:|\/|#)/i.test(href)) {
          element.removeAttribute("href");
        }
        return;
      }

      if (name === "target" || name === "rel") {
        return;
      }

      if (name === "style") {
        const cleanStyle = normalizeStyle(attribute.value);
        if (cleanStyle) {
          element.setAttribute("style", cleanStyle);
        } else {
          element.removeAttribute("style");
        }
        return;
      }

      element.removeAttribute(attribute.name);
    });

    if (element.tagName === "A" && element.getAttribute("target") === "_blank") {
      element.setAttribute("rel", "noreferrer");
    }

    if (element.tagName === "SPAN" && !element.attributes.length) {
      unwrapNode(element);
    }
  });

  root.querySelectorAll("span span").forEach((span) => {
    if (!span.getAttribute("style") && !span.attributes.length) {
      unwrapNode(span);
    }
  });

  root.querySelectorAll("p,div,h1,h2,h3,h4,h5,h6,li,blockquote").forEach((element) => {
    if (!element.textContent.trim() && !element.querySelector("br,img")) {
      element.remove();
    }
  });
}

function cleanHtml(html) {
  if (!html || typeof document === "undefined") return "";

  const container = document.createElement("div");
  container.innerHTML = html;
  cleanDom(container);

  return container.innerHTML
    .replace(/(<br\s*\/?>\s*){3,}/gi, "<br><br>")
    .trim();
}

export default function RichTextEditor({ value = "", onChange, placeholder = "Enter text..." }) {
  const editorRef = useRef(null);
  const savedRangeRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    if (editor.innerHTML !== (value || "")) {
      editor.innerHTML = value || "";
      cleanDom(editor);
      setCharacterCount(editor.innerText.length);
    }
  }, [value]);

  function emitChange() {
    const editor = editorRef.current;
    if (!editor) return;

    cleanDom(editor);
    setCharacterCount(editor.innerText.length);
    onChange(cleanHtml(editor.innerHTML));
  }

  function saveSelection() {
    const selection = window.getSelection();
    const editor = editorRef.current;
    if (!selection?.rangeCount || !editor) return;

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
      ? range.commonAncestorContainer
      : range.commonAncestorContainer.parentNode;

    if (container && editor.contains(container)) {
      savedRangeRef.current = range.cloneRange();
    }
  }

  function restoreSelection() {
    const selection = window.getSelection();
    if (!selection || !savedRangeRef.current) return;

    selection.removeAllRanges();
    selection.addRange(savedRangeRef.current);
  }

  function applyInlineStyle(property, value) {
    const editor = editorRef.current;
    if (!editor || !value) return;

    restoreSelection();

    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedRoot = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
      ? range.commonAncestorContainer
      : range.commonAncestorContainer.parentNode;

    if (!selectedRoot || !editor.contains(selectedRoot)) return;

    const targets = getStyleTargets(range, editor);
    targets.forEach((target) => {
      target.style[property] = value;
      normalizeElementStyle(target);
    });

    cleanDom(editor);
    emitChange();
    editor.focus();
    saveSelection();
  }

  function applyBlock(tag) {
    restoreSelection();
    document.execCommand("formatBlock", false, tag);
    emitChange();
    editorRef.current?.focus();
    saveSelection();
  }

  function applyList(command) {
    restoreSelection();
    document.execCommand(command, false);
    emitChange();
    editorRef.current?.focus();
    saveSelection();
  }

  function clearFormatting() {
    restoreSelection();
    document.execCommand("removeFormat", false);
    emitChange();
    editorRef.current?.focus();
    saveSelection();
  }

  function insertLink() {
    restoreSelection();

    const url = prompt("Enter URL (https://, mailto:, tel:, /page, or #section):");
    if (!url || !/^(https?:|mailto:|tel:|\/|#)/i.test(url.trim())) return;

    document.execCommand("createLink", false, url.trim());
    emitChange();
    editorRef.current?.focus();
    saveSelection();
  }

  const buttonClass = "grid size-9 place-items-center rounded-lg border border-primary/10 bg-white text-sm font-black text-primary transition hover:border-primary/30 hover:bg-primary/5 sm:size-10";
  const selectClass = "h-9 rounded-lg border border-primary/10 bg-white px-3 text-xs font-black text-primary outline-none transition hover:border-primary/30 hover:bg-primary/5 sm:h-10";

  return (
    <div className="overflow-hidden rounded-lg border border-primary/10 bg-white shadow-sm">
      <div className="border-b border-primary/10 bg-paper p-3 sm:p-4">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button type="button" className={buttonClass} title="Bold" onMouseDown={saveSelection} onClick={() => applyInlineStyle("fontWeight", "700")}>
            <FaIcon name="bold" className="size-4" />
          </button>
          <button type="button" className={buttonClass} title="Italic" onMouseDown={saveSelection} onClick={() => applyInlineStyle("fontStyle", "italic")}>
            <FaIcon name="italic" className="size-4" />
          </button>
          <button type="button" className={buttonClass} title="Underline" onMouseDown={saveSelection} onClick={() => applyInlineStyle("textDecoration", "underline")}>
            <FaIcon name="underline" className="size-4" />
          </button>

          <div className="w-px bg-primary/10" />

          {["p", "h1", "h2", "h3", "h4", "h5", "h6"].map((tag) => (
            <button key={tag} type="button" className="rounded-lg border border-primary/10 bg-white px-3 py-2 text-xs font-black uppercase text-primary transition hover:border-primary/30 hover:bg-primary/5" title={tag.toUpperCase()} onMouseDown={saveSelection} onClick={() => applyBlock(tag)}>
              {tag}
            </button>
          ))}

          <div className="w-px bg-primary/10" />

          <button type="button" className={buttonClass} title="Bullet List" onMouseDown={saveSelection} onClick={() => applyList("insertUnorderedList")}>
            <FaIcon name="list" className="size-4" />
          </button>
          <button type="button" className={buttonClass} title="Numbered List" onMouseDown={saveSelection} onClick={() => applyList("insertOrderedList")}>
            <FaIcon name="listNumber" className="size-4" />
          </button>
          <button type="button" className={buttonClass} title="Insert Link" onMouseDown={saveSelection} onClick={insertLink}>
            <FaIcon name="link" className="size-4" />
          </button>

          <select className={selectClass} defaultValue="" title="Font Size" onMouseDown={saveSelection} onChange={(event) => {
            applyInlineStyle("fontSize", event.target.value);
            event.target.value = "";
          }}>
            <option value="">Size</option>
            {fontSizeOptions.map((size) => <option key={size} value={size}>{size}</option>)}
          </select>

          <select className={selectClass} defaultValue="" title="Text Color" onMouseDown={saveSelection} onChange={(event) => {
            applyInlineStyle("color", event.target.value);
            event.target.value = "";
          }}>
            <option value="">Color</option>
            {colorOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>

          <input
            type="color"
            className="h-9 w-10 rounded-lg border border-primary/10 bg-white p-1 transition hover:border-primary/30 hover:bg-primary/5 sm:h-10"
            defaultValue="#5C264F"
            title="Custom Text Color"
            onMouseDown={saveSelection}
            onChange={(event) => applyInlineStyle("color", event.target.value)}
          />

          <button type="button" className={`${buttonClass} ml-auto`} title="Clear Formatting" onMouseDown={saveSelection} onClick={clearFormatting}>
            <FaIcon name="eraser" className="size-4" />
          </button>
        </div>
      </div>

      <div
        ref={editorRef}
        contentEditable
        data-placeholder={placeholder}
        className={`rich-text-editor min-h-64 w-full p-4 text-base leading-7 text-ink outline-none transition focus:ring-2 focus:ring-primary/20 ${isFocused ? "ring-2 ring-primary/20" : ""}`}
        onInput={emitChange}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          saveSelection();
          emitChange();
          setIsFocused(false);
        }}
        suppressContentEditableWarning
      />

      <div className="flex justify-between border-t border-primary/10 bg-paper px-4 py-2 text-xs font-bold text-primary/50">
        <span>{characterCount} characters</span>
        <span className="text-primary/30">Only selected formatting is saved</span>
      </div>
    </div>
  );
}

function getStyleTargets(range, editor) {
  const selector = "p,div,h1,h2,h3,h4,h5,h6,li,blockquote,a,strong,b,em,i,u";
  const targets = new Set();
  const elements = editor.querySelectorAll(selector);

  elements.forEach((element) => {
    if (range.intersectsNode(element)) {
      targets.add(element);
    }
  });

  if (targets.size) {
    return [...targets];
  }

  const container = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
    ? range.commonAncestorContainer
    : range.commonAncestorContainer.parentElement;
  const fallback = container?.closest(selector);

  if (fallback && editor.contains(fallback)) {
    return [fallback];
  }

  return [editor];
}
