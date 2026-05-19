import { NextResponse } from "next/server";
import { readCmsData, writeCmsData } from "@/lib/cmsStore";

const backendUrl = process.env.BACKEND_API_URL;

export async function POST(request) {
  const payload = await request.json();

  if (backendUrl) {
    const response = await fetch(`${backendUrl}/api/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  }

  const data = await readCmsData();
  const appointment = {
    id: `appointment-${Date.now()}`,
    name: payload.name || "",
    phone: payload.phone || "",
    email: payload.email || "",
    service: payload.service || "",
    date: payload.date || "",
    message: payload.message || "",
    status: "New",
    createdAt: new Date().toISOString()
  };

  data.appointments = [appointment, ...(data.appointments || [])];
  await writeCmsData(data);

  return NextResponse.json({ ok: true, appointment });
}
