"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { categories as defaultCategories, services as defaultServices } from "@/lib/services";
import FaIcon from "@/components/FaIcon";

export default function ServiceBrowser({ initialCategory = "All", initialType = "national", limit, showAllButton = false, services = defaultServices, categories = defaultCategories }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [serviceType, setServiceType] = useState(initialType === "international" ? "international" : "national");

  const scopedCategories = useMemo(() => {
    return categories.filter((item) =>
      services.some((service) => (service.serviceType || "national") === serviceType && service.category === item && service.enabled !== false)
    );
  }, [categories, serviceType, services]);

  const visibleServices = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return services.filter((service) => {
      if (service.enabled === false) {
        return false;
      }

      const matchesType = (service.serviceType || "national") === serviceType;
      const matchesCategory = category === "All" || service.category === category;
      const matchesQuery =
        !normalized ||
        service.title.toLowerCase().includes(normalized) ||
        service.category.toLowerCase().includes(normalized);

      return matchesType && matchesCategory && matchesQuery;
    });
  }, [category, query, serviceType, services]);

  const shownServices = typeof limit === "number" ? visibleServices.slice(0, limit) : visibleServices;

  return (
    <div>
      <div className="mb-5 inline-flex rounded-full border border-primary/10 bg-white p-1 shadow-sm shadow-primary/5">
        {[
          ["national", "National Services"],
          ["international", "International Services"]
        ].map(([value, label]) => (
          <button
            className={`min-h-11 rounded-full px-5 text-sm font-black transition ${serviceType === value ? "bg-primary text-white shadow-lg shadow-primary/15" : "text-primary hover:bg-secondary"}`}
            key={value}
            type="button"
            onClick={() => {
              setServiceType(value);
              setCategory("All");
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mb-8 grid gap-3 md:grid-cols-[minmax(220px,1fr)_260px]">
        <label className="relative block">
          <FaIcon className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-primary/45" name="search" />
          <input
            className="min-h-14 w-full rounded-2xl border border-primary/10 bg-white pl-12 pr-5 text-sm font-semibold text-ink outline-none shadow-sm shadow-primary/5 transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search services"
            type="search"
          />
        </label>
        <select
          className="min-h-14 rounded-2xl border border-primary/10 bg-white px-5 text-sm font-bold text-primary outline-none shadow-sm shadow-primary/5 transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="All">All Categories</option>
          {scopedCategories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {shownServices.map((service) => (
          <Link
            className="group flex min-h-64 flex-col justify-between overflow-hidden rounded-[1.5rem] border border-primary/10 bg-white p-6 shadow-sm shadow-primary/5 transition duration-300 hover:-translate-y-2 hover:border-primary/25 hover:shadow-2xl hover:shadow-primary/15"
            key={service.slug}
            href={`/services/${service.slug}`}
          >
            <div>
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-14 place-items-center rounded-2xl bg-secondary/50 transition duration-300 group-hover:rotate-3 group-hover:scale-110">
                  <FaIcon className="size-7 text-primary" name={service.icon} />
                </span>
                <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-black text-primary">
                  {service.category}
                </span>
              </div>
              <h3 className="mt-7 text-2xl font-black leading-tight text-primary">{service.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{service.summary}</p>
            </div>
            <div className="mt-8 flex items-center justify-between gap-3">
              <strong className="text-primary">{service.formattedPrice}</strong>
              <span className="rounded-full border border-primary/15 px-4 py-2 text-xs font-black text-primary transition duration-300 group-hover:bg-primary group-hover:text-white">
                Details
              </span>
            </div>
          </Link>
        ))}
      </div>

      {showAllButton ? (
        <div className="mt-10 flex justify-center">
          <Link className="group inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-black text-white shadow-xl shadow-primary/20 transition duration-300 hover:-translate-y-1 hover:bg-primary/90" href="/services">
            See All Services
            <FaIcon className="ml-2 size-4 transition duration-300 group-hover:translate-x-1" name="arrowRight" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
