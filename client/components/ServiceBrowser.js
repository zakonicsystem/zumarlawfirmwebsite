"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { categories as defaultCategories, services as defaultServices } from "@/lib/services";
import FaIcon from "@/components/FaIcon";

export default function ServiceBrowser({ initialCategory = "All", initialType = "national", limit, showAllButton = false, services = defaultServices, categories = defaultCategories }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [serviceType, setServiceType] = useState(initialType === "international" ? "international" : "national");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    const typeParam = params.get("type");

    if (categoryParam) {
      setCategory(categoryParam);
    }

    if (typeParam === "international" || typeParam === "national") {
      setServiceType(typeParam);
    }
  }, []);

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
      <div className="mb-5 grid w-full grid-cols-2 rounded-full border border-primary/10 bg-white p-1 shadow-sm shadow-primary/5 sm:inline-grid sm:w-auto">
        {[
          ["national", "National Services"],
          ["international", "International Services"]
        ].map(([value, label]) => (
          <button
            className={`min-h-11 rounded-full px-3 text-xs font-black transition sm:px-5 sm:text-sm ${serviceType === value ? "bg-primary text-white shadow-lg shadow-primary/15" : "text-primary hover:bg-secondary"}`}
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

      <div className="mb-7 grid gap-3 md:mb-8 md:grid-cols-[minmax(220px,1fr)_260px]">
        <label className="relative block">
          <FaIcon className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-primary/45" name="search" />
          <input
            className="min-h-13 w-full rounded-xl border border-primary/10 bg-white pl-12 pr-5 text-sm font-semibold text-ink outline-none shadow-sm shadow-primary/5 transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10 sm:min-h-14 sm:rounded-2xl"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search services"
            type="search"
          />
        </label>
        <select
          className="min-h-13 rounded-xl border border-primary/10 bg-white px-5 text-sm font-bold text-primary outline-none shadow-sm shadow-primary/5 transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10 sm:min-h-14 sm:rounded-2xl"
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

      <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
        {shownServices.map((service) => (
          <Link
            className="group flex min-h-56 flex-col justify-between overflow-hidden rounded-lg border border-primary/10 bg-white p-4 shadow-sm shadow-primary/5 transition duration-300 hover:-translate-y-2 hover:border-primary/25 hover:shadow-2xl hover:shadow-primary/15 sm:min-h-64 sm:p-6"
            key={service.slug}
            href={`/services/${service.slug}`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-secondary/50 transition duration-300 group-hover:rotate-3 group-hover:scale-110 sm:size-14 sm:rounded-2xl">
                  <FaIcon className="size-6 text-primary sm:size-7" name={service.icon} />
                </span>
                <span className="rounded-full bg-secondary px-3 py-1.5 text-[11px] font-black leading-tight text-primary sm:text-xs">
                  {service.category}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-black leading-tight text-primary sm:mt-7 sm:text-2xl">{service.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted sm:leading-7">{service.summary}</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8">
              <strong className="text-primary">{service.formattedPrice}</strong>
              <div className="flex items-center gap-2">
                <span className="flex-1 rounded-full border border-primary/15 px-3 py-2 text-center text-xs font-black text-primary transition duration-300 group-hover:bg-primary group-hover:text-white">
                  Details
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open("https://app.zumarlawfirm.com/signup", "_blank");
                  }}
                  className="flex-1 rounded-full bg-secondary px-3 py-2 text-center text-xs font-black text-primary transition duration-300 hover:bg-secondary/80 hover:shadow-lg cursor-pointer"
                  type="button"
                >
                  Start Online
                </button>
              </div>
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
