import crypto from "crypto";
import { existsSync, readFileSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { login, requireAdmin } from "./lib/auth.js";
import { createCorsHeaders, methodNotAllowed, notFound, parsePath, readBuffer, readJson, sendJson, sendNoContent } from "./lib/http.js";
import { createStore, resolveDataFile } from "./lib/store.js";
import { collectionKey, normalizeAppointment, normalizeRecord, publicCmsData } from "./lib/validation.js";

loadEnvFile();

const config = loadConfig();
const store = createStore(config);

const server = http.createServer(async (request, response) => {
  const corsHeaders = createCorsHeaders(request.headers.origin, config.clientOrigin);

  if (request.method === "OPTIONS") {
    sendNoContent(response, corsHeaders);
    return;
  }

  try {
    await route(request, response, corsHeaders);
  } catch (error) {
    sendJson(response, error.statusCode || 500, { error: error.message || "Internal server error" }, corsHeaders);
  }
});

server.listen(config.port, config.host, () => {
  console.log(`Zumar backend listening on http://${config.host}:${config.port}`);
});

async function route(request, response, headers) {
  const { parts } = parsePath(request.url);

  if (request.method === "GET" && parts.join("/") === "health") {
    const storage = await store.health();
    sendJson(response, 200, { ok: true, service: "zumar-law-firm-backend", storage }, headers);
    return;
  }

  if (request.method === "GET" && parts[0] === "uploads" && parts[1]) {
    await sendUploadFile(response, headers, parts.slice(1).join("/"));
    return;
  }

  if (parts[0] !== "api") {
    notFound(response, headers);
    return;
  }

  if (parts[1] === "auth" && parts[2] === "login") {
    if (request.method !== "POST") {
      methodNotAllowed(response, headers);
      return;
    }

    const payload = await readJson(request);
    sendJson(response, 200, login(payload, config), headers);
    return;
  }

  if (parts[1] === "content") {
    if (request.method !== "GET") {
      methodNotAllowed(response, headers);
      return;
    }

    const data = await store.read();
    sendJson(response, 200, publicCmsData(data), headers);
    return;
  }

  if (parts[1] === "appointments" && request.method === "POST") {
    const payload = await readJson(request);
    const saved = await store.update(async (data) => {
      const appointment = normalizeAppointment(payload);
      data.appointments = [appointment, ...(data.appointments || [])];
      return data;
    });

    sendJson(response, 201, { ok: true, appointment: saved.appointments[0] }, headers);
    return;
  }

  if (parts[1] === "admin") {
    requireAdmin(request, config);
    await routeAdmin(request, response, headers, parts);
    return;
  }

  await routePublicCollection(request, response, headers, parts);
}

async function routeAdmin(request, response, headers, parts) {
  if (parts[2] === "upload") {
    if (request.method !== "POST") {
      methodNotAllowed(response, headers);
      return;
    }

    sendJson(response, 201, await saveUploadedImage(request), headers);
    return;
  }

  if (parts[2] === "content") {
    if (request.method === "GET") {
      sendJson(response, 200, await store.read(), headers);
      return;
    }

    if (request.method === "PUT") {
      const payload = await readJson(request);
      sendJson(response, 200, await store.write(payload), headers);
      return;
    }

    methodNotAllowed(response, headers);
    return;
  }

  if (parts[2] === "appointments") {
    await routeAdminAppointments(request, response, headers, parts[3]);
    return;
  }

  await routeAdminCollection(request, response, headers, parts);
}

async function routeAdminAppointments(request, response, headers, id) {
  if (request.method === "GET" && !id) {
    const data = await store.read();
    sendJson(response, 200, data.appointments || [], headers);
    return;
  }

  if (request.method === "PATCH" && id) {
    const payload = await readJson(request);
    const saved = await store.update(async (data) => {
      data.appointments = (data.appointments || []).map((item) => (item.id === id ? { ...item, ...payload, id: item.id, createdAt: item.createdAt } : item));
      return data;
    });
    sendJson(response, 200, saved.appointments.find((item) => item.id === id) || null, headers);
    return;
  }

  if (request.method === "DELETE" && id) {
    await store.update(async (data) => {
      data.appointments = (data.appointments || []).filter((item) => item.id !== id);
      return data;
    });
    sendNoContent(response, headers);
    return;
  }

  methodNotAllowed(response, headers);
}

async function routePublicCollection(request, response, headers, parts) {
  const key = collectionKey(parts[1]);

  if (!key) {
    notFound(response, headers);
    return;
  }

  if (request.method !== "GET") {
    methodNotAllowed(response, headers);
    return;
  }

  const data = await store.read();
  const records = (data[key] || []).filter((item) => item.enabled !== false);
  const id = parts[2];
  sendJson(response, 200, id ? records.find((item) => item.id === id || item.slug === id) || null : records, headers);
}

async function routeAdminCollection(request, response, headers, parts) {
  const key = collectionKey(parts[2]);
  const id = parts[3];

  if (!key) {
    notFound(response, headers);
    return;
  }

  if (request.method === "GET") {
    const data = await store.read();
    sendJson(response, 200, id ? (data[key] || []).find((item) => item.id === id || item.slug === id) || null : data[key] || [], headers);
    return;
  }

  if (request.method === "POST") {
    const payload = normalizeRecord(await readJson(request), key);
    const saved = await store.update(async (data) => {
      data[key] = [payload, ...(data[key] || [])];
      return data;
    });
    sendJson(response, 201, saved[key][0], headers);
    return;
  }

  if (request.method === "PATCH" && id) {
    const payload = await readJson(request);
    const saved = await store.update(async (data) => {
      data[key] = (data[key] || []).map((item) => (item.id === id || item.slug === id ? normalizeRecord({ ...item, ...payload, id: item.id }, key) : item));
      return data;
    });
    sendJson(response, 200, (saved[key] || []).find((item) => item.id === id || item.slug === id) || null, headers);
    return;
  }

  if (request.method === "DELETE" && id) {
    await store.update(async (data) => {
      data[key] = (data[key] || []).filter((item) => item.id !== id && item.slug !== id);
      return data;
    });
    sendNoContent(response, headers);
    return;
  }

  methodNotAllowed(response, headers);
}

function loadConfig() {
  return {
    port: Number(process.env.PORT || 4000),
    host: process.env.HOST || "0.0.0.0",
    clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    dataFile: resolveDataFile(process.env.CMS_DATA_FILE || "./data/cms-content.json"),
    uploadDir: resolveServerPath(process.env.UPLOAD_DIR || "./uploads"),
    uploadPublicUrl: process.env.UPLOAD_PUBLIC_URL || `http://${process.env.HOST || "0.0.0.0"}:${process.env.PORT || 4000}/uploads`,
    maxUploadBytes: Number(process.env.MAX_UPLOAD_BYTES || 8 * 1024 * 1024),
    mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017",
    mongoDatabase: process.env.MONGODB_DATABASE || "zumar_law_firm",
    mongoCollection: process.env.MONGODB_COLLECTION || "cms_content",
    mongoMaxPoolSize: process.env.MONGODB_MAX_POOL_SIZE || "10",
    mongoServerSelectionTimeoutMs: process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || "5000",
    adminEmail: process.env.ADMIN_EMAIL || "admin@zumarlawfirm.com",
    adminPassword: process.env.ADMIN_PASSWORD || "admin123",
    adminToken: process.env.ADMIN_TOKEN || "change-this-token-before-production"
  };
}

async function saveUploadedImage(request) {
  const contentType = request.headers["content-type"] || "";
  const boundary = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i)?.[1] || contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i)?.[2];

  if (!boundary) {
    const error = new Error("Upload must use multipart/form-data.");
    error.statusCode = 400;
    throw error;
  }

  const body = await readBuffer(request, config.maxUploadBytes);
  const file = parseMultipartImage(body, boundary);
  const extension = imageExtension(file.contentType, file.filename);
  const basename = `${Date.now()}-${crypto.randomUUID()}${extension}`;

  await mkdir(config.uploadDir, { recursive: true });
  await writeFile(path.join(config.uploadDir, basename), file.content);

  return {
    ok: true,
    filename: basename,
    url: `${config.uploadPublicUrl.replace(/\/$/, "")}/${basename}`,
    size: file.content.length,
    contentType: file.contentType
  };
}

function parseMultipartImage(body, boundary) {
  const delimiter = Buffer.from(`--${boundary}`);
  let cursor = 0;

  while (cursor < body.length) {
    const start = body.indexOf(delimiter, cursor);

    if (start === -1) {
      break;
    }

    const partStart = start + delimiter.length;
    const next = body.indexOf(delimiter, partStart);

    if (next === -1) {
      break;
    }

    let part = body.subarray(partStart, next);

    if (part.subarray(0, 2).toString() === "\r\n") {
      part = part.subarray(2);
    }

    if (part.subarray(0, 2).toString() === "--") {
      break;
    }

    const headerEnd = part.indexOf(Buffer.from("\r\n\r\n"));

    if (headerEnd === -1) {
      cursor = next;
      continue;
    }

    const headers = part.subarray(0, headerEnd).toString("utf8");
    let content = part.subarray(headerEnd + 4);

    if (content.subarray(content.length - 2).toString() === "\r\n") {
      content = content.subarray(0, content.length - 2);
    }

    const disposition = headers.match(/content-disposition:[^\r\n]+/i)?.[0] || "";
    const filename = disposition.match(/filename="([^"]+)"/i)?.[1] || "";
    const contentType = headers.match(/content-type:\s*([^\r\n]+)/i)?.[1]?.trim() || "";

    if (filename) {
      if (!contentType.startsWith("image/")) {
        const error = new Error("Only image uploads are allowed.");
        error.statusCode = 415;
        throw error;
      }

      return { filename, contentType, content };
    }

    cursor = next;
  }

  const error = new Error("No image file found in upload.");
  error.statusCode = 400;
  throw error;
}

function imageExtension(contentType, filename) {
  const byType = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "image/avif": ".avif"
  };

  if (byType[contentType]) {
    return byType[contentType];
  }

  const extension = path.extname(filename || "").toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"].includes(extension) ? extension : ".img";
}

async function sendUploadFile(response, headers, filename) {
  const safeName = path.basename(filename);
  const filePath = path.join(config.uploadDir, safeName);
  const extension = path.extname(safeName).toLowerCase();
  const contentType = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".avif": "image/avif"
  }[extension] || "application/octet-stream";

  try {
    const file = await readFile(filePath);
    response.writeHead(200, {
      ...headers,
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable"
    });
    response.end(file);
  } catch {
    notFound(response, headers);
  }
}

function resolveServerPath(configuredPath) {
  return path.isAbsolute(configuredPath) ? configuredPath : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", configuredPath);
}

function loadEnvFile() {
  const currentFile = fileURLToPath(import.meta.url);
  const serverRoot = path.resolve(path.dirname(currentFile), "..");
  const envFile = path.join(serverRoot, ".env");

  if (!existsSync(envFile)) {
    return;
  }

  const lines = readFileSync(envFile, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const equalsIndex = trimmed.indexOf("=");

    if (equalsIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    const value = trimmed.slice(equalsIndex + 1).trim().replace(/^["']|["']$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

async function shutdown() {
  await store.close();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
