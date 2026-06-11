"use client";

import { useState } from "react";
import RichContent from "@/components/RichContent";

export default function AppointmentForm({ branches = [], services = [], content = {} }) {
  const initialService = services[0]?.title || "";
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    branch: branches[0]?.name || "",
    service: initialService,
    date: "",
    message: ""
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedService = services.find((service) => service.title === form.service) || services[0];
  const requirements = selectedService?.requirements || [];

  async function submit(event) {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setStatus("Sending...");

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        setStatus(content.successText || "Appointment request submitted.");
        setForm({ name: "", phone: "", email: "", branch: branches[0]?.name || "", service: initialService, date: "", message: "" });
        return;
      }

      setStatus(content.errorText || "Unable to submit appointment.");
    } catch {
      setStatus(content.errorText || "Unable to submit appointment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateService(value) {
    setForm((current) => ({ ...current, service: value }));
  }

  return (
    <form onSubmit={submit} className="w-full min-w-0 rounded-3xl border border-primary/10 bg-white p-5 shadow-xl shadow-primary/5 sm:rounded-[2rem] sm:p-9">
      <h2 className="text-2xl font-black text-primary sm:text-3xl">{content.formTitle ? <RichContent content={content.formTitle} inline /> : "Appointment Request"}</h2>
      <div className="mt-6 grid min-w-0 gap-4">
        <Field label="Name" value={form.name} onChange={(value) => update("name", value)} required />
        <Field label="Phone" value={form.phone} onChange={(value) => update("phone", value)} required />
        <Field label="Email" type="email" value={form.email} onChange={(value) => update("email", value)} />
        <label className="grid min-w-0 gap-2 text-sm font-black text-primary">
          Select Branch
          <select className="min-h-12 w-full min-w-0 rounded-2xl border border-primary/10 px-4 font-semibold text-ink outline-none focus:ring-4 focus:ring-primary/10" value={form.branch} onChange={(event) => update("branch", event.target.value)} required>
            {!branches.length ? <option value="">Select a branch</option> : null}
            {branches.map((branch) => <option key={branch.slug || branch.name}>{branch.name}</option>)}
          </select>
        </label>
        <label className="grid min-w-0 gap-2 text-sm font-black text-primary">
          Service
          <select className="min-h-12 w-full min-w-0 rounded-2xl border border-primary/10 px-4 font-semibold text-ink outline-none focus:ring-4 focus:ring-primary/10" value={form.service} onChange={(event) => updateService(event.target.value)}>
            {!services.length ? <option value="">Select a service</option> : null}
            {services.map((service) => <option key={service.slug}>{service.title}</option>)}
          </select>
        </label>
        {requirements.length ? (
          <div className="grid min-w-0 gap-4 rounded-2xl bg-paper p-4">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-primary/60">Details Required</p>
              <p className="mt-1 text-sm font-bold text-muted">{selectedService.formattedPrice}</p>
            </div>
            <ul className="grid min-w-0 gap-2">
              {requirements.map((item) => (
                <li className="flex min-w-0 gap-3 rounded-xl bg-white px-4 py-3 text-sm font-bold text-ink/80" key={item}>
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                  <span className="min-w-0 break-words">{item && <RichContent content={item} />}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <Field label="Preferred Date" type="date" value={form.date} onChange={(value) => update("date", value)} />
        <label className="grid min-w-0 gap-2 text-sm font-black text-primary">
          Message
          <textarea className="min-h-28 w-full min-w-0 rounded-2xl border border-primary/10 px-4 py-3 font-semibold text-ink outline-none focus:ring-4 focus:ring-primary/10" value={form.message} onChange={(event) => update("message", event.target.value)} />
        </label>
      </div>
      {status ? <p className="mt-4 rounded-2xl bg-secondary px-4 py-3 text-sm font-black text-primary">{status}</p> : null}
      <button className="mt-5 min-h-12 w-full rounded-full bg-primary px-6 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : content.submitLabel || "Submit Appointment"}
      </button>
    </form>
  );
}

function Field({ label, value, onChange, type = "text", required = false }) {
  return (
    <label className="grid min-w-0 gap-2 text-sm font-black text-primary">
      {label}
      <input required={required} className="min-h-12 w-full min-w-0 rounded-2xl border border-primary/10 px-4 font-semibold text-ink outline-none focus:ring-4 focus:ring-primary/10" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
