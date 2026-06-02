"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FaIcon from "@/components/FaIcon";

export default function HomeHeroSlider({ slides = [] }) {
  const visibleSlides = useMemo(() => slides.filter((slide) => slide.enabled !== false), [slides]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (visibleSlides.length < 2) {
      return undefined;
    }

    const timer = setInterval(() => {
      setActive((index) => (index + 1) % visibleSlides.length);
    }, 6500);

    return () => clearInterval(timer);
  }, [visibleSlides.length]);

  useEffect(() => {
    if (active >= visibleSlides.length) {
      setActive(0);
    }
  }, [active, visibleSlides.length]);

  if (visibleSlides.length === 0) {
    return null;
  }

  const current = visibleSlides[active] || visibleSlides[0];
  const blocks = (current.blocks || []).filter((block) => block.enabled !== false).slice(0, 3);

  return (
    <section className="relative min-h-[500px] overflow-hidden bg-primary text-white sm:min-h-[500px]" data-page-load>
      {current.image ? (
        <Image
          className="absolute inset-0 h-full w-full object-cover transition duration-[1400ms]"
          src={current.image}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          key={`${current.title}-${active}`}
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/78 to-primary/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />

      <div className="relative z-10 mx-auto flex min-h-[500px] w-[min(1180px,calc(100%-32px))] items-center py-20 sm:min-h-[500px]">
        <div className="max-w-3xl" key={active}>
          <p className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-secondary backdrop-blur animate-[heroFade_0.75s_ease-out_both]">
            <FaIcon className="size-3.5" name="scale" />
            {current.eyebrow}
          </p>
          <h1 className="text-3xl font-black leading-[0.95] text-white animate-[heroRise_0.85s_ease-out_both] sm:text-4xl lg:text-4xl">
            {current.title}
          </h1>

          {blocks.length > 0 && (
            <div className="mt-7 grid gap-3 sm:grid-cols-3 animate-[heroRise_0.9s_ease-out_both]">
              {blocks.map((block, index) => (
                <div key={`${current.title}-block-${index}`} className="rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur">
                  {block.icon && (
                    <FaIcon className="mb-2 size-5 text-secondary" name={block.icon} />
                  )}
                  <h3 className="text-xs font-black uppercase tracking-wide text-secondary">{block.label}</h3>
                  <p className="mt-1 text-xs font-semibold leading-5 text-white/80">{block.value}</p>
                </div>
              ))}
            </div>
          )}

          <p className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-white/80 animate-[heroRise_0.95s_ease-out_both] sm:text-xl">
            {current.copy}
          </p>

          <div className="mt-9 flex flex-wrap gap-3 animate-[heroRise_1.05s_ease-out_both]">
            {current.primaryLabel ? (
              <SmartLink className="inline-flex min-h-13 items-center justify-center rounded-full bg-secondary px-7 text-sm font-black uppercase tracking-wide text-primary shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:bg-white" href={current.primaryHref || "/services"}>
                {current.primaryLabel}
                <FaIcon className="ml-2 size-3.5" name="arrowRight" />
              </SmartLink>
            ) : null}
            {current.secondaryLabel ? (
              <SmartLink className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/25 bg-white/10 px-7 text-sm font-black uppercase tracking-wide text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white hover:text-primary" href={current.secondaryHref || "/contact"}>
                {current.secondaryLabel}
              </SmartLink>
            ) : null}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-20 flex w-[min(1180px,calc(100%-32px))] -translate-x-1/2 items-center justify-between gap-5">
        <div className="flex gap-2">
          {visibleSlides.map((slide, index) => (
            <button
              className={`h-2.5 rounded-full transition-all ${index === active ? "w-12 bg-secondary" : "w-2.5 bg-white/45 hover:bg-white"}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show slide ${index + 1}`}
              key={`${slide.title}-dot-${index}`}
            />
          ))}
        </div>
        <div className="hidden rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/80 backdrop-blur sm:block">
          Zumar Law Firm
        </div>
      </div>
    </section>
  );
}

function SmartLink({ href, className, children }) {
  const value = href || "/";
  const isExternal = /^https?:\/\//i.test(value);

  if (isExternal) {
    return (
      <a className={className} href={value} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link className={className} href={value}>
      {children}
    </Link>
  );
}
