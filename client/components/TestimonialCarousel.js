"use client";

import { useEffect, useMemo, useState } from "react";
import FaIcon from "@/components/FaIcon";
import RichContent from "@/components/RichContent";

export default function TestimonialCarousel({ items = [] }) {
  const testimonials = useMemo(() => items.filter((item) => item.enabled !== false), [items]);
  const slides = useMemo(() => chunkItems(testimonials, 3), [testimonials]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % slides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div data-reveal="zoom">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {slides.map((slide, slideIndex) => (
            <div className="min-w-full px-1 sm:px-2" key={`testimonial-slide-${slideIndex}`}>
              <div className="grid items-stretch gap-5 lg:grid-cols-3">
                {slide.map((item, itemIndex) => (
                  <TestimonialCard item={item} key={`${item.name}-${itemIndex}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-secondary hover:text-primary"
          type="button"
          aria-label="Previous testimonial"
          onClick={() => setActive((index) => (index - 1 + slides.length) % slides.length)}
        >
          <FaIcon className="size-4" name="arrowLeft" />
        </button>
        <div className="flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              className={`h-2.5 rounded-full transition-all ${index === active ? "w-10 bg-secondary" : "w-2.5 bg-white/35 hover:bg-white/70"}`}
              type="button"
              aria-label={`Show testimonial group ${index + 1}`}
              onClick={() => setActive(index)}
              key={`testimonial-dot-${index}`}
            />
          ))}
        </div>
        <button
          className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-secondary hover:text-primary"
          type="button"
          aria-label="Next testimonial"
          onClick={() => setActive((index) => (index + 1) % slides.length)}
        >
          <FaIcon className="size-4" name="arrowRight" />
        </button>
      </div>
    </div>
  );
}

function chunkItems(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function TestimonialCard({ item }) {
  return (
    <article className="group relative flex h-[440px] flex-col justify-between overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-6 shadow-2xl shadow-black/10 backdrop-blur transition duration-300 hover:-translate-y-2 hover:bg-white/[0.13] sm:h-[400px] lg:h-[460px]">
      <div className="absolute -right-10 -top-10 size-32 rounded-full bg-secondary/10 transition duration-500 group-hover:scale-125" />
      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between gap-4">
          <span className="grid size-16 place-items-center rounded-2xl bg-secondary text-primary shadow-xl shadow-black/10">
            <FaIcon className="size-8" name={item.icon || "quote"} />
          </span>
          <div className="flex gap-1 text-secondary" aria-label={`${item.rating || 5} star rating`}>
            {Array.from({ length: Math.max(1, Math.min(5, Number(item.rating) || 5)) }).map((_, starIndex) => (
              <FaIcon className="size-4" name="star" key={starIndex} />
            ))}
          </div>
        </div>
        <div className="mt-7 min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:thin]">
          <div className="text-lg font-semibold leading-8 text-white/82">"{item.quote && <RichContent content={item.quote} />}"</div>
        </div>
        <div className="mt-7 shrink-0 border-t border-white/10 pt-5">
          <h3 className="text-xl font-black">{item.name && <RichContent content={item.name} />}</h3>
          <div className="mt-1 text-sm font-bold text-secondary/90">{item.role && <RichContent content={item.role} />}</div>
        </div>
      </div>
    </article>
  );
}
