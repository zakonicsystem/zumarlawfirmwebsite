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

const allowedTags = new Set(["A", "B", "BLOCKQUOTE", "BR", "CAPTION", "COL", "COLGROUP", "DIV", "EM", "H1", "H2", "H3", "H4", "H5", "H6", "I", "LI", "OL", "P", "SPAN", "STRONG", "TABLE", "TBODY", "TD", "TFOOT", "TH", "THEAD", "TR", "U", "UL"]);
const allowedStyles = new Set(["color", "font-size", "font-style", "font-weight", "text-align", "text-decoration"]);

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

function decodeHtmlEntities(content) {
  let html = String(content || "");

  if (!/&(?:lt|gt|amp|quot|#39);/i.test(html) || typeof document === "undefined") {
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

function normalizeElementStyle(element) {
  const cleanStyle = normalizeStyle(element.getAttribute("style") || "");

  if (cleanStyle) {
    element.setAttribute("style", cleanStyle);
  } else {
    element.removeAttribute("style");
  }
}

function clearStyleProperty(element, property) {
  element.style[property] = "";
  normalizeElementStyle(element);
}

function setStyleProperty(element, property, value) {
  if (value === null || value === undefined || value === "") {
    clearStyleProperty(element, property);
    element.querySelectorAll("[style]").forEach((child) => clearStyleProperty(child, property));
    return;
  }

  element.style[property] = value;
  normalizeElementStyle(element);
}

function isStyleApplied(element, property, value) {
  const computed = window.getComputedStyle(element);

  if (property === "fontWeight") {
    return Number(computed.fontWeight) >= 600;
  }

  if (property === "fontStyle") {
    return computed.fontStyle === value;
  }

  if (property === "textDecoration") {
    return computed.textDecorationLine.includes(value);
  }

  return element.style[property] === value;
}

function mergeStyle(element, styleText) {
  const cleanStyle = normalizeStyle(`${element.getAttribute("style") || ""}; ${styleText || ""}`);

  if (cleanStyle) {
    element.setAttribute("style", cleanStyle);
  } else {
    element.removeAttribute("style");
  }
}

function significantChildren(element) {
  return [...element.childNodes].filter((child) => child.nodeType !== Node.TEXT_NODE || child.textContent.trim());
}

function unwrapNode(node) {
  const parent = node.parentNode;
  if (!parent) return;

  while (node.firstChild) {
    parent.insertBefore(node.firstChild, node);
  }

  parent.removeChild(node);
}

function replaceTag(element, tagName) {
  const replacement = document.createElement(tagName);

  [...element.attributes].forEach((attribute) => {
    replacement.setAttribute(attribute.name, attribute.value);
  });

  while (element.firstChild) {
    replacement.appendChild(element.firstChild);
  }

  element.replaceWith(replacement);
  return replacement;
}

function cleanDom(root) {
  const elements = [...root.querySelectorAll("*")].reverse();

  elements.forEach((element) => {
    if (element.tagName === "DIV") {
      element = replaceTag(element, "p");
    }

    if (element.tagName === "B") {
      element = replaceTag(element, "strong");
    }

    if (element.tagName === "I") {
      element = replaceTag(element, "em");
    }

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

      if ((name === "colspan" || name === "rowspan") && (element.tagName === "TD" || element.tagName === "TH")) {
        const value = Math.max(1, Math.min(12, Number.parseInt(attribute.value, 10) || 1));
        element.setAttribute(name, String(value));
        return;
      }

      if (name === "scope" && element.tagName === "TH" && /^(col|row)$/i.test(attribute.value)) {
        element.setAttribute("scope", attribute.value.toLowerCase());
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

  root.querySelectorAll("p,h1,h2,h3,h4,h5,h6,li,blockquote").forEach((element) => {
    const children = significantChildren(element);
    const onlyChild = children.length === 1 ? children[0] : null;

    if (onlyChild?.nodeType === Node.ELEMENT_NODE && onlyChild.tagName === "SPAN") {
      mergeStyle(element, onlyChild.getAttribute("style") || "");
      unwrapNode(onlyChild);
    }
  });

  root.querySelectorAll("span span").forEach((span) => {
    const parent = span.parentElement;

    if (parent?.tagName === "SPAN") {
      mergeStyle(parent, span.getAttribute("style") || "");
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
  container.innerHTML = decodeHtmlEntities(html);
  cleanDom(container);

  return container.innerHTML
    .replace(/(<br\s*\/?>\s*){3,}/gi, "<br><br>")
    .trim();
}

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function looksLikeHeading(line) {
  const text = String(line || "").trim();
  const words = text.split(/\s+/).filter(Boolean);

  if (!text || words.length > 12 || text.length > 95) {
    return false;
  }

  if (/[.;,]$/.test(text)) {
    return false;
  }

  return /\?$/.test(text) || /^(about|benefits|documents|eligibility|faq|how|overview|required|requirements|service|what|when|where|who|why)\b/i.test(text);
}

function tableHtmlFromRows(rows) {
  const body = rows
    .map((row, rowIndex) => {
      const cells = row.map((cell) => {
        const tag = rowIndex === 0 ? "th" : "td";
        const scope = tag === "th" ? " scope=\"col\"" : "";
        return `<${tag}${scope}>${escapeHtml(cell) || "<br>"}</${tag}>`;
      }).join("");

      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `<table><tbody>${body}</tbody></table>`;
}

function plainTextToCleanHtml(text) {
  const lines = String(text || "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim());
  const blocks = [];
  let paragraph = [];

  function flushParagraph() {
    if (!paragraph.length) return;
    blocks.push(`<p>${escapeHtml(paragraph.join(" "))}</p>`);
    paragraph = [];
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (!line) {
      flushParagraph();
      continue;
    }

    if (line.includes("\t")) {
      const rows = [];
      flushParagraph();

      while (index < lines.length && lines[index]?.includes("\t")) {
        rows.push(lines[index].split("\t").map((cell) => cell.trim()));
        index += 1;
      }

      index -= 1;
      blocks.push(tableHtmlFromRows(rows));
      continue;
    }

    if (looksLikeHeading(line)) {
      flushParagraph();
      blocks.push(`<h3>${escapeHtml(line)}</h3>`);
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  return blocks.join("");
}

export default function RichTextEditor({ value = "", onChange, placeholder = "Enter text..." }) {
  const editorRef = useRef(null);
  const savedRangeRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    document.execCommand("defaultParagraphSeparator", false, "p");

    const nextHtml = decodeHtmlEntities(value || "");

    if (editor.innerHTML !== nextHtml) {
      editor.innerHTML = nextHtml;
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

  function keepEditorSelection(event) {
    event.preventDefault();
    saveSelection();
  }

  function restoreSelection() {
    const selection = window.getSelection();
    if (!selection || !savedRangeRef.current) return;

    selection.removeAllRanges();
    selection.addRange(savedRangeRef.current);
  }

  function withSelection(callback) {
    const editor = editorRef.current;
    if (!editor) return;

    restoreSelection();

    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedRoot = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
      ? range.commonAncestorContainer
      : range.commonAncestorContainer.parentNode;

    if (!selectedRoot || !editor.contains(selectedRoot)) return;

    const targets = getStyleTargets(range, editor);
    if (!targets.length) {
      return;
    }

    callback(targets);

    cleanDom(editor);
    emitChange();
    editor.focus({ preventScroll: true });
    saveSelection();
  }

  function applyInlineStyle(property, value) {
    if (!value) return;

    withSelection((targets) => {
      targets.forEach((target) => {
        setStyleProperty(target, property, value);
      });
    });
  }

  function toggleInlineStyle(property, activeValue) {
    withSelection((targets) => {
      const shouldRemove = targets.some((target) => isStyleApplied(target, property, activeValue));

      targets.forEach((target) => {
        setStyleProperty(target, property, shouldRemove ? null : activeValue);
      });
    });
  }

  function runCommand(command, value = null) {
    restoreSelection();
    document.execCommand(command, false, value);
    emitChange();
    editorRef.current?.focus({ preventScroll: true });
    saveSelection();
  }

  function applyBlock(tag) {
    restoreSelection();
    document.execCommand("formatBlock", false, tag);
    emitChange();
    editorRef.current?.focus({ preventScroll: true });
    saveSelection();
  }

  function applyList(command) {
    restoreSelection();
    document.execCommand(command, false);
    emitChange();
    editorRef.current?.focus({ preventScroll: true });
    saveSelection();
  }

  function clearFormatting() {
    restoreSelection();
    document.execCommand("removeFormat", false);
    emitChange();
    editorRef.current?.focus({ preventScroll: true });
    saveSelection();
  }

  function insertLink() {
    restoreSelection();

    const url = prompt("Enter URL (https://, mailto:, tel:, /page, or #section):");
    if (!url || !/^(https?:|mailto:|tel:|\/|#)/i.test(url.trim())) return;

    document.execCommand("createLink", false, url.trim());
    emitChange();
    editorRef.current?.focus({ preventScroll: true });
    saveSelection();
  }

  function getTableCell() {
    const selection = window.getSelection();
    const editor = editorRef.current;
    if (!selection?.rangeCount || !editor) return null;

    const node = selection.getRangeAt(0).startContainer;
    const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    const cell = element?.closest("td,th");

    return cell && editor.contains(cell) ? cell : null;
  }

  function selectNodeStart(node) {
    const selection = window.getSelection();
    if (!selection || !node) return;

    const range = document.createRange();
    range.selectNodeContents(node);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    savedRangeRef.current = range.cloneRange();
  }

  function insertHtmlAtSelection(html) {
    const editor = editorRef.current;
    if (!editor) return;

    restoreSelection();

    const selection = window.getSelection();
    if (!selection?.rangeCount || !editor.contains(selection.anchorNode)) {
      const range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }

    const activeSelection = window.getSelection();
    if (!activeSelection?.rangeCount) return;

    const range = activeSelection.getRangeAt(0);
    const template = document.createElement("template");
    template.innerHTML = html;
    const fragment = template.content;
    const firstNode = fragment.firstElementChild;
    const lastNode = fragment.lastChild;

    range.deleteContents();
    range.insertNode(fragment);

    if (lastNode?.parentNode) {
      range.setStartAfter(lastNode);
      range.collapse(true);
      activeSelection.removeAllRanges();
      activeSelection.addRange(range);
    }

    cleanDom(editor);
    emitChange();
    editor.focus({ preventScroll: true });
    saveSelection();

    if (firstNode) {
      const firstCell = firstNode.querySelector?.("td,th");
      if (firstCell) {
        selectNodeStart(firstCell);
      }
    }
  }

  function insertTable() {
    insertHtmlAtSelection(tableHtmlFromRows([
      ["Header 1", "Header 2", "Header 3"],
      ["", "", ""],
      ["", "", ""]
    ]));
  }

  function updateTable(callback) {
    const cell = getTableCell();
    if (!cell) return;

    callback(cell);
    emitChange();
    editorRef.current?.focus({ preventScroll: true });
    saveSelection();
  }

  function addTableRow() {
    updateTable((cell) => {
      const row = cell.closest("tr");
      const columns = row?.children.length || 1;
      const nextRow = document.createElement("tr");

      for (let index = 0; index < columns; index += 1) {
        const td = document.createElement("td");
        td.innerHTML = "<br>";
        nextRow.appendChild(td);
      }

      row?.after(nextRow);
      selectNodeStart(nextRow.firstElementChild);
    });
  }

  function addTableColumn() {
    updateTable((cell) => {
      const row = cell.closest("tr");
      const table = cell.closest("table");
      const index = [...row.children].indexOf(cell);

      table?.querySelectorAll("tr").forEach((tableRow) => {
        const sourceCell = tableRow.children[index];
        const tagName = sourceCell?.tagName === "TH" ? "th" : "td";
        const newCell = document.createElement(tagName);
        if (tagName === "th") {
          newCell.setAttribute("scope", "col");
        }
        newCell.innerHTML = "<br>";
        sourceCell?.after(newCell);
      });
    });
  }

  function deleteTableRow() {
    updateTable((cell) => {
      const row = cell.closest("tr");
      const table = cell.closest("table");

      if ((table?.querySelectorAll("tr").length || 0) <= 1) {
        table?.remove();
        return;
      }

      row?.remove();
    });
  }

  function deleteTableColumn() {
    updateTable((cell) => {
      const row = cell.closest("tr");
      const table = cell.closest("table");
      const index = [...row.children].indexOf(cell);
      const firstRow = table?.querySelector("tr");

      if ((firstRow?.children.length || 0) <= 1) {
        table?.remove();
        return;
      }

      table?.querySelectorAll("tr").forEach((tableRow) => {
        tableRow.children[index]?.remove();
      });
    });
  }

  function deleteTable() {
    updateTable((cell) => {
      cell.closest("table")?.remove();
    });
  }

  function handlePaste(event) {
    const text = event.clipboardData?.getData("text/plain");

    if (!text) {
      return;
    }

    event.preventDefault();
    insertHtmlAtSelection(plainTextToCleanHtml(text));
  }

  function getCurrentBlock() {
    const selection = window.getSelection();
    const editor = editorRef.current;
    if (!selection?.rangeCount || !editor) return null;

    const node = selection.getRangeAt(0).startContainer;
    const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    const block = element?.closest("p,h1,h2,h3,h4,h5,h6,li,blockquote");

    return block && editor.contains(block) ? block : null;
  }

  function handleKeyDown(event) {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    const block = getCurrentBlock();
    if (!block || !/^H[1-6]$/.test(block.tagName)) {
      return;
    }

    window.setTimeout(() => {
      document.execCommand("formatBlock", false, "p");
      emitChange();
      saveSelection();
    }, 0);
  }

  const buttonClass = "grid size-9 place-items-center rounded-lg border border-primary/10 bg-white text-sm font-black text-primary transition hover:border-primary/30 hover:bg-primary/5 sm:size-10";
  const selectClass = "h-9 rounded-lg border border-primary/10 bg-white px-3 text-xs font-black text-primary outline-none transition hover:border-primary/30 hover:bg-primary/5 sm:h-10";

  return (
    <div className="rounded-lg border border-primary/10 bg-white shadow-sm">
      <div className="sticky top-20 z-10 rounded-t-lg border-b border-primary/10 bg-paper p-3 shadow-sm sm:p-4">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button type="button" className={buttonClass} title="Bold" onMouseDown={keepEditorSelection} onClick={() => runCommand("bold")}>
            <FaIcon name="bold" className="size-4" />
          </button>
          <button type="button" className={buttonClass} title="Italic" onMouseDown={keepEditorSelection} onClick={() => runCommand("italic")}>
            <FaIcon name="italic" className="size-4" />
          </button>
          <button type="button" className={buttonClass} title="Underline" onMouseDown={keepEditorSelection} onClick={() => runCommand("underline")}>
            <FaIcon name="underline" className="size-4" />
          </button>

          <div className="w-px bg-primary/10" />

          {["p", "h1", "h2", "h3", "h4", "h5", "h6"].map((tag) => (
            <button key={tag} type="button" className="rounded-lg border border-primary/10 bg-white px-3 py-2 text-xs font-black uppercase text-primary transition hover:border-primary/30 hover:bg-primary/5" title={tag.toUpperCase()} onMouseDown={keepEditorSelection} onClick={() => applyBlock(tag)}>
              {tag}
            </button>
          ))}

          <div className="w-px bg-primary/10" />

          {[
            ["left", "alignLeft", "Align Left"],
            ["center", "alignCenter", "Align Center"],
            ["right", "alignRight", "Align Right"],
            ["justify", "alignJustify", "Justify"]
          ].map(([value, icon, label]) => (
            <button key={value} type="button" className={buttonClass} title={label} onMouseDown={keepEditorSelection} onClick={() => applyInlineStyle("textAlign", value)}>
              <FaIcon name={icon} className="size-4" />
            </button>
          ))}

          <div className="w-px bg-primary/10" />

          <button type="button" className={buttonClass} title="Bullet List" onMouseDown={keepEditorSelection} onClick={() => applyList("insertUnorderedList")}>
            <FaIcon name="list" className="size-4" />
          </button>
          <button type="button" className={buttonClass} title="Numbered List" onMouseDown={keepEditorSelection} onClick={() => applyList("insertOrderedList")}>
            <FaIcon name="listNumber" className="size-4" />
          </button>
          <button type="button" className={buttonClass} title="Insert Link" onMouseDown={keepEditorSelection} onClick={insertLink}>
            <FaIcon name="link" className="size-4" />
          </button>

          <button type="button" className={buttonClass} title="Insert Table" onMouseDown={keepEditorSelection} onClick={insertTable}>
            <FaIcon name="table" className="size-4" />
          </button>
          <button type="button" className="rounded-lg border border-primary/10 bg-white px-3 py-2 text-xs font-black text-primary transition hover:border-primary/30 hover:bg-primary/5" title="Add Table Row" onMouseDown={keepEditorSelection} onClick={addTableRow}>
            + Row
          </button>
          <button type="button" className="rounded-lg border border-primary/10 bg-white px-3 py-2 text-xs font-black text-primary transition hover:border-primary/30 hover:bg-primary/5" title="Add Table Column" onMouseDown={keepEditorSelection} onClick={addTableColumn}>
            + Col
          </button>
          <button type="button" className="rounded-lg border border-primary/10 bg-white px-3 py-2 text-xs font-black text-primary transition hover:border-primary/30 hover:bg-primary/5" title="Delete Table Row" onMouseDown={keepEditorSelection} onClick={deleteTableRow}>
            - Row
          </button>
          <button type="button" className="rounded-lg border border-primary/10 bg-white px-3 py-2 text-xs font-black text-primary transition hover:border-primary/30 hover:bg-primary/5" title="Delete Table Column" onMouseDown={keepEditorSelection} onClick={deleteTableColumn}>
            - Col
          </button>
          <button type="button" className={buttonClass} title="Delete Table" onMouseDown={keepEditorSelection} onClick={deleteTable}>
            <FaIcon name="trash" className="size-4" />
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

          <button type="button" className={`${buttonClass} ml-auto`} title="Clear Formatting" onMouseDown={keepEditorSelection} onClick={clearFormatting}>
            <FaIcon name="eraser" className="size-4" />
          </button>
        </div>
      </div>

      <div
        ref={editorRef}
        contentEditable
        data-placeholder={placeholder}
        className={`rich-text-editor min-h-64 w-full p-4 text-base font-normal leading-7 text-ink outline-none transition focus:ring-2 focus:ring-primary/20 ${isFocused ? "ring-2 ring-primary/20" : ""}`}
        onInput={emitChange}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
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
  const blockSelector = "p,div,h1,h2,h3,h4,h5,h6,li,blockquote";
  const targets = new Set();
  const blockElements = editor.querySelectorAll(blockSelector);

  blockElements.forEach((element) => {
    if (range.intersectsNode(element)) {
      targets.add(element);
    }
  });

  if (targets.size) {
    return [...targets];
  }

  editor.querySelectorAll("a").forEach((element) => {
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
  const fallback = container?.closest(blockSelector) || container?.closest("a");

  if (fallback && editor.contains(fallback)) {
    return [fallback];
  }

  return [];
}
