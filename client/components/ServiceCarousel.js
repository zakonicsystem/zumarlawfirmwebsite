"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { services } from "@/lib/services";
import FaIcon from "@/components/FaIcon";
import RichContent from "@/components/RichContent";
import { plainText } from "@/lib/text";

export default function ServiceCarousel({ items }) {
  const [index, setIndex] = useState(0);
  const [activeHeight, setActiveHeight] = useState(0);
  const [canAutoRotate, setCanAutoRotate] = useState(false);
  const viewport = useRef(null);
  const thumbnailScroll = useRef(null);
  const slideRefs = useRef([]);
  const featured = useMemo(() => (Array.isArray(items) && items.length > 0 ? items : services).filter((service) => service.enabled !== false).slice(0, 14), [items]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const updateAutoRotate = () => setCanAutoRotate(media.matches);

    updateAutoRotate();
    media.addEventListener("change", updateAutoRotate);

    return () => media.removeEventListener("change", updateAutoRotate);
  }, []);

  useEffect(() => {
    if (!canAutoRotate || featured.length === 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % featured.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, [canAutoRotate, featured.length]);

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
    <div className="relative overflow-hidden rounded-lg border border-primary/10 bg-white p-3 shadow-xl shadow-primary/10 sm:rounded-[2rem] sm:p-6 sm:shadow-2xl">
      <div className="relative mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-primary/55 sm:text-xs sm:tracking-[0.22em]">Featured Services</p>
          <h3 className="mt-2 text-2xl font-black leading-tight text-primary sm:text-4xl">Browse services in motion</h3>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            className="grid size-10 place-items-center rounded-full border border-primary/15 bg-white font-black text-primary shadow-lg shadow-primary/5 transition hover:-translate-x-0.5 hover:bg-secondary sm:size-11"
            onClick={() => setIndex((current) => (current - 1 + featured.length) % featured.length)}
            type="button"
            aria-label="Previous service"
          >
            <FaIcon className="size-4" name="arrowLeft" />
          </button>
          <span className="rounded-full bg-paper px-3 py-2 text-xs font-black text-primary sm:px-4 sm:text-sm">
            {String(index + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")}
          </span>
          <button
            className="grid size-10 place-items-center rounded-full border border-primary/15 bg-white font-black text-primary shadow-lg shadow-primary/5 transition hover:translate-x-0.5 hover:bg-secondary sm:size-11"
            onClick={() => setIndex((current) => (current + 1) % featured.length)}
            type="button"
            aria-label="Next service"
          >
            <FaIcon className="size-4" name="arrowRight" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-primary/10 bg-white transition-[height] duration-500 sm:rounded-[1.5rem]" style={activeHeight ? { height: activeHeight } : undefined}>
        <div ref={viewport} className="flex transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]" style={{ transform: `translate3d(-${index * 100}%,0,0)` }}>
          {featured.map((service, itemIndex) => (
            <div
              className={`min-w-full transition-all duration-300 ${itemIndex === index ? "scale-100 opacity-100" : "scale-95 opacity-70"}`}
              key={service.slug}
              ref={(element) => {
                slideRefs.current[itemIndex] = element;
              }}
            >
              <article className={`group block overflow-hidden bg-white rounded-lg transition-all duration-300 sm:rounded-[1.5rem] ${itemIndex === index ? "ring-2 ring-secondary shadow-xl shadow-secondary/20 sm:shadow-2xl sm:shadow-secondary/30" : ""}`}>
                <div className="relative flex flex-col overflow-hidden p-4 sm:p-7 lg:p-8">
                  <div className="pointer-events-none absolute -right-20 -top-24 hidden size-72 rounded-full bg-secondary/25 sm:block" />
                  <div className="pointer-events-none absolute -bottom-28 left-1/2 hidden size-80 rounded-full bg-primary/5 sm:block" />
                  <div>
                    <div className="mb-4 flex flex-wrap items-center gap-2 sm:mb-5 sm:gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-[11px] font-black uppercase tracking-wide text-white sm:px-4 sm:text-xs">
                        <FaIcon className="size-3.5 text-secondary" name={service.icon} />
                        {service.category}
                      </span>
                      {service.serviceType ? (
                        <span className="rounded-full bg-secondary px-3 py-2 text-[11px] font-black uppercase tracking-wide text-primary sm:px-4 sm:text-xs">
                          {service.serviceType}
                        </span>
                      ) : null}
                    </div>
                    {service.title ? <RichContent as="h3" className="max-w-3xl text-2xl font-black leading-tight text-primary rich-content-compact rich-content-clamp-2 sm:text-5xl" content={service.title} /> : null}
                    <div className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:mt-4 sm:text-base sm:leading-7">{service.summary && <RichContent className="rich-content-compact rich-content-clamp-3" content={service.summary} />}</div>
                  </div>

                  <div className="relative mt-5 grid gap-4 rounded-lg border border-primary/10 bg-paper p-3 sm:mt-6 sm:rounded-[1.25rem] sm:p-4">
                    <span>
                      <span className="block text-xs font-black uppercase tracking-wide text-primary/55">Starting From</span>
                      <strong className="mt-1 block text-xl leading-none text-primary sm:text-2xl">{service.formattedPrice}</strong>
                      <span className="mt-2 block text-sm font-semibold leading-5 text-muted">Open details for scope and document requirements.</span>
                    </span>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <Link href={`/services/${service.slug}`} prefetch={false} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-xs font-black uppercase tracking-wide text-white transition duration-300 hover:bg-secondary hover:text-primary sm:min-h-12 sm:px-6 sm:text-sm">
                        View Details
                        <FaIcon className="size-3.5 transition group-hover:translate-x-1" name="arrowRight" />
                      </Link>
                      <a href="https://app.zumarlawfirm.com/signup" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-secondary px-5 text-xs font-black uppercase tracking-wide text-primary transition duration-300 hover:bg-secondary/90 sm:min-h-12 sm:px-6 sm:text-sm">
                        <FaIcon className="size-3.5" name="registration" />
                        Start Online
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-lg bg-paper p-2 sm:mt-5 sm:rounded-[1.25rem]">
        <div ref={thumbnailScroll} className="flex gap-2 overflow-x-auto pb-1 snap-x scroll-smooth hide-scrollbar">
          {featured.map((service, itemIndex) => (
            <button
              aria-label={`Show ${plainText(service.title, "service")}`}
              className={`min-w-[136px] rounded-lg p-3 text-left transition snap-start sm:min-w-[180px] sm:rounded-2xl ${itemIndex === index ? "bg-primary text-white shadow-lg shadow-primary/15" : "bg-white text-primary hover:bg-secondary/45"}`}
              key={service.slug}
              onClick={() => setIndex(itemIndex)}
              type="button"
            >
              <span className="flex items-center gap-2">
                <FaIcon className={itemIndex === index ? "size-4 text-secondary" : "size-4 text-primary"} name={service.icon} />
                <span className="line-clamp-1 text-xs font-black uppercase tracking-wide">{service.category}</span>
              </span>
              <span className={`mt-2 line-clamp-2 block text-sm font-black ${itemIndex === index ? "text-white" : "text-ink"}`}>{service.title && <RichContent className="rich-content-compact" content={service.title} inline />}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
