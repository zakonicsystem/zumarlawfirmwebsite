import { NextResponse } from "next/server";

const backendUrl = process.env.BACKEND_API_URL;

export async function POST(request) {
  if (!backendUrl) {
    return NextResponse.json({ error: "Backend upload server is not configured." }, { status: 503 });
  }

  const authorization = request.headers.get("authorization") || "";
  const formData = await request.formData();
  const response = await fetch(`${backendUrl}/api/admin/upload`, {
    method: "POST",
    headers: {
      Authorization: authorization
    },
    body: formData
  });

  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
