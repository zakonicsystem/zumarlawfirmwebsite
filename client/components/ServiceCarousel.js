"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { services } from "@/lib/services";
import FaIcon from "@/components/FaIcon";

export default function ServiceCarousel({ items }) {
  const [index, setIndex] = useState(0);
  const [activeHeight, setActiveHeight] = useState(0);
  const viewport = useRef(null);
  const thumbnailScroll = useRef(null);
  const slideRefs = useRef([]);
  const featured = useMemo(() => (Array.isArray(items) && items.length > 0 ? items : services).filter((service) => service.enabled !== false).slice(0, 14), [items]);

  useEffect(() => {
    if (featured.length === 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % featured.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, [featured.length]);

  useEffect(() => {
    function updateHeight() {
      const activeSlide = slideRefs.current[index];
      if (activeSlide) {
        setActiveHeight(activeSlide.offsetHeight);
      }
    }

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, [featured.length, index]);

  useEffect(() => {
    if (!thumbnailScroll.current) {
      return;
    }

    const container = thumbnailScroll.current;
    const buttons = container.querySelectorAll("button");
    const activeButton = buttons[index];

    if (activeButton) {
      const containerWidth = container.offsetWidth;
      const buttonWidth = activeButton.offsetWidth;
      const buttonLeft = activeButton.offsetLeft;
      const scrollPosition = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);

      container.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: "smooth"
      });
    }
  }, [index]);

  if (featured.length === 0) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-white p-4 shadow-2xl shadow-primary/10 sm:p-6">
      <div className="relative mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary/55">Featured Services</p>
          <h3 className="mt-2 text-2xl font-black leading-tight text-primary sm:text-4xl">Browse services in motion</h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="grid size-11 place-items-center rounded-full border border-primary/15 bg-white font-black text-primary shadow-lg shadow-primary/5 transition hover:-translate-x-0.5 hover:bg-secondary"
            onClick={() => setIndex((current) => (current - 1 + featured.length) % featured.length)}
            type="button"
            aria-label="Previous service"
          >
            <FaIcon className="size-4" name="arrowLeft" />
          </button>
          <span className="rounded-full bg-paper px-4 py-2 text-sm font-black text-primary">
            {String(index + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")}
          </span>
          <button
            className="grid size-11 place-items-center rounded-full border border-primary/15 bg-white font-black text-primary shadow-lg shadow-primary/5 transition hover:translate-x-0.5 hover:bg-secondary"
            onClick={() => setIndex((current) => (current + 1) % featured.length)}
            type="button"
            aria-label="Next service"
          >
            <FaIcon className="size-4" name="arrowRight" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[1.5rem] border border-primary/10 bg-white transition-[height] duration-500" style={activeHeight ? { height: activeHeight } : undefined}>
        <div ref={viewport} className="flex transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]" style={{ transform: `translate3d(-${index * 100}%,0,0)` }}>
          {featured.map((service, itemIndex) => (
            <div
              className={`min-w-full transition-all duration-300 ${itemIndex === index ? "scale-100 opacity-100" : "scale-95 opacity-70"}`}
              key={service.slug}
              ref={(element) => {
                slideRefs.current[itemIndex] = element;
              }}
            >
              <Link href={`/services/${service.slug}`} className={`group block overflow-hidden bg-white rounded-[1.5rem] transition-all duration-300 ${itemIndex === index ? "ring-2 ring-secondary shadow-2xl shadow-secondary/30" : ""}`}>
                <div className="relative flex flex-col overflow-hidden p-5 sm:p-7 lg:p-8">
                  <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-secondary/45 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-28 left-1/2 size-80 rounded-full bg-primary/10 blur-3xl" />
                  <div>
                    <div className="mb-5 flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-black uppercase tracking-wide text-white">
                        <FaIcon className="size-3.5 text-secondary" name={service.icon} />
                        {service.category}
                      </span>
                      {service.serviceType ? (
                        <span className="rounded-full bg-secondary px-4 py-2 text-xs font-black uppercase tracking-wide text-primary">
                          {service.serviceType}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="max-w-3xl text-3xl font-black leading-tight text-primary sm:text-5xl">{service.title}</h3>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">{service.summary}</p>
                  </div>

                  <div className="relative mt-6 grid gap-4 rounded-[1.25rem] border border-primary/10 bg-paper p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                    <span>
                      <span className="block text-xs font-black uppercase tracking-wide text-primary/55">Starting From</span>
                      <strong className="mt-1 block text-2xl leading-none text-primary">{service.formattedPrice}</strong>
                      <span className="mt-2 block text-sm font-semibold text-muted">Open details for scope and document requirements.</span>
                    </span>
                    <span className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-black uppercase tracking-wide text-white transition duration-300 group-hover:bg-secondary group-hover:text-primary">
                      View Details
                      <FaIcon className="size-3.5 transition group-hover:translate-x-1" name="arrowRight" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-5 overflow-hidden rounded-[1.25rem] bg-paper p-2">
        <div ref={thumbnailScroll} className="flex gap-2 overflow-x-auto pb-1 snap-x scroll-smooth hide-scrollbar">
          {featured.map((service, itemIndex) => (
            <button
              aria-label={`Show ${service.title}`}
              className={`min-w-[150px] rounded-2xl p-3 text-left transition snap-start sm:min-w-[180px] ${itemIndex === index ? "bg-primary text-white shadow-lg shadow-primary/15" : "bg-white text-primary hover:bg-secondary/45"}`}
              key={service.slug}
              onClick={() => setIndex(itemIndex)}
              type="button"
            >
              <span className="flex items-center gap-2">
                <FaIcon className={itemIndex === index ? "size-4 text-secondary" : "size-4 text-primary"} name={service.icon} />
                <span className="line-clamp-1 text-xs font-black uppercase tracking-wide">{service.category}</span>
              </span>
              <span className={`mt-2 line-clamp-1 block text-sm font-black ${itemIndex === index ? "text-white" : "text-ink"}`}>{service.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
