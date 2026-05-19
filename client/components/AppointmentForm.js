"use client";

import { useState } from "react";

export default function AppointmentForm({ services, content = {} }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: services[0]?.title || "", date: "", message: "" });
  const [status, setStatus] = useState("");

  async function submit(event) {
    event.preventDefault();
    setStatus("Sending...");
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (response.ok) {
      setStatus(content.successText || "Appointment request submitted.");
      setForm({ name: "", phone: "", email: "", service: services[0]?.title || "", date: "", message: "" });
    } else {
      setStatus(content.errorText || "Unable to submit appointment.");
    }
  }

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <form onSubmit={submit} className="rounded-[2rem] border border-primary/10 bg-white p-7 shadow-xl shadow-primary/5 sm:p-9">
      <h2 className="text-3xl font-black text-primary">{content.formTitle || "Appointment Request"}</h2>
      <div className="mt-6 grid gap-4">
        <Field label="Name" value={form.name} onChange={(value) => update("name", value)} required />
        <Field label="Phone" value={form.phone} onChange={(value) => update("phone", value)} required />
        <Field label="Email" type="email" value={form.email} onChange={(value) => update("email", value)} />
        <label className="grid gap-2 text-sm font-black text-primary">
          Service
          <select className="min-h-12 rounded-2xl border border-primary/10 px-4 font-semibold text-ink outline-none focus:ring-4 focus:ring-primary/10" value={form.service} onChange={(event) => update("service", event.target.value)}>
            {services.map((service) => <option key={service.slug}>{service.title}</option>)}
          </select>
        </label>
        <Field label="Preferred Date" type="date" value={form.date} onChange={(value) => update("date", value)} />
        <label className="grid gap-2 text-sm font-black text-primary">
          Message
          <textarea className="min-h-28 rounded-2xl border border-primary/10 px-4 py-3 font-semibold text-ink outline-none focus:ring-4 focus:ring-primary/10" value={form.message} onChange={(event) => update("message", event.target.value)} />
        </label>
      </div>
      {status ? <p className="mt-4 rounded-2xl bg-secondary px-4 py-3 text-sm font-black text-primary">{status}</p> : null}
      <button className="mt-5 min-h-12 rounded-full bg-primary px-6 text-sm font-black text-white">{content.submitLabel || "Submit Appointment"}</button>
    </form>
  );
}

function Field({ label, value, onChange, type = "text", required = false }) {
  return (
    <label className="grid gap-2 text-sm font-black text-primary">
      {label}
      <input required={required} className="min-h-12 rounded-2xl border border-primary/10 px-4 font-semibold text-ink outline-none focus:ring-4 focus:ring-primary/10" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
