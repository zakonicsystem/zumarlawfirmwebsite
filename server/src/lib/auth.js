import crypto from "crypto";

export function requireAdmin(request, config) {
  const header = request.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";

  if (!token || !timingSafeEqual(token, config.adminToken)) {
    const error = new Error("Admin authorization required.");
    error.statusCode = 401;
    throw error;
  }
}

export function login(payload, config) {
  const email = String(payload.email || "").trim().toLowerCase();
  const password = String(payload.password || "");

  if (email !== config.adminEmail.toLowerCase() || password !== config.adminPassword) {
    const error = new Error("Invalid admin login.");
    error.statusCode = 401;
    throw error;
  }

  return {
    token: config.adminToken,
    user: {
      email: config.adminEmail,
      role: "admin"
    }
  };
}

function timingSafeEqual(value, expected) {
  const left = Buffer.from(String(value));
  const right = Buffer.from(String(expected));

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}
