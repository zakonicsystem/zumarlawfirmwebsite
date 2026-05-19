import { NextResponse } from "next/server";
import { readCmsData } from "@/lib/cmsStore";

const backendUrl = process.env.BACKEND_API_URL;

export async function POST(request) {
  const payload = await request.json();

  if (backendUrl) {
    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  }

  const data = await readCmsData();
  const email = String(payload.email || "").trim().toLowerCase();
  const password = String(payload.password || "");
  const adminEmail = String(data.settings?.adminEmail || "admin@zumarlawfirm.com");
  const adminPassword = String(data.settings?.adminPassword || "admin123");

  if (email !== adminEmail.toLowerCase() || password !== adminPassword) {
    return NextResponse.json({ error: "Invalid admin login." }, { status: 401 });
  }

  return NextResponse.json({
    token: "local-next-admin",
    user: {
      email: adminEmail,
      role: "admin"
    }
  });
}
