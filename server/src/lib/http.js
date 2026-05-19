export function sendJson(response, statusCode, payload, headers = {}) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    ...headers
  });
  response.end(JSON.stringify(payload));
}

export function sendNoContent(response, headers = {}) {
  response.writeHead(204, headers);
  response.end();
}

export function notFound(response, headers = {}) {
  sendJson(response, 404, { error: "Not found" }, headers);
}

export function methodNotAllowed(response, headers = {}) {
  sendJson(response, 405, { error: "Method not allowed" }, headers);
}

export async function readJson(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const body = Buffer.concat(chunks).toString("utf8").trim();

  if (!body) {
    return {};
  }

  try {
    return JSON.parse(body);
  } catch {
    const error = new Error("Request body must be valid JSON.");
    error.statusCode = 400;
    throw error;
  }
}

export async function readBuffer(request, maxBytes = 8 * 1024 * 1024) {
  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;

    if (size > maxBytes) {
      const error = new Error("Uploaded file is too large.");
      error.statusCode = 413;
      throw error;
    }

    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

export function createCorsHeaders(origin, allowedOrigin) {
  const allowOrigin = allowedOrigin === "*" || !origin || origin === allowedOrigin ? allowedOrigin : "null";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400"
  };
}

export function parsePath(requestUrl) {
  const url = new URL(requestUrl, "http://localhost");
  const parts = url.pathname.split("/").filter(Boolean).map(decodeURIComponent);
  return { url, parts };
}
