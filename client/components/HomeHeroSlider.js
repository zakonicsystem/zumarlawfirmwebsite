"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FaIcon from "@/components/FaIcon";
import RichContent from "@/components/RichContent";
import { plainText } from "@/lib/text";

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

  const seoSlide = visibleSlides[0];
  const current = visibleSlides[active] || seoSlide;
  const blocks = (current.blocks || []).filter((block) => block.enabled !== false).slice(0, 3);

  return (
    <section className="relative min-h-[430px] overflow-hidden bg-primary text-white sm:min-h-[500px]" data-page-load>
      {current.image ? (
        <Image
          className="absolute inset-0 h-full w-full object-cover transition duration-[1400ms]"
          src={current.image}
          alt={`${plainText(current.title || seoSlide.title, "Zumar Law Firm service")} hero image`}
          fill
          priority
          quality={72}
          sizes="(max-width: 640px) 100vw, 100vw"
          key={`${current.image || active}`}
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/78 to-primary/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />

      <div className="relative z-10 mx-auto flex min-h-[430px] w-[min(1180px,calc(100%-24px))] items-center py-14 pb-16 sm:min-h-[500px] sm:w-[min(1180px,calc(100%-32px))] sm:py-20">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-secondary backdrop-blur animate-[heroFade_0.75s_ease-out_both] sm:mb-5 sm:gap-3 sm:px-4 sm:text-xs sm:tracking-[0.2em]">
            <FaIcon className="size-3.5" name="scale" />
            <span className="truncate">{seoSlide.eyebrow && <RichContent content={seoSlide.eyebrow} />}</span>
          </p>
          <h1 className="text-3xl font-black leading-tight text-white animate-[heroRise_0.85s_ease-out_both] sm:text-4xl sm:leading-[0.95] lg:text-4xl">
            {seoSlide.title && <RichContent content={seoSlide.title} />}
          </h1>

          {blocks.length > 0 && (
            <div className="mt-5 grid gap-2 min-[420px]:grid-cols-3 sm:mt-7 sm:gap-3 animate-[heroRise_0.9s_ease-out_both]">
              {blocks.map((block, index) => (
                <div key={`${current.title}-block-${index}`} className="rounded-lg border border-white/15 bg-white/10 p-2.5 backdrop-blur sm:p-3">
                  {block.icon && (
                    <FaIcon className="mb-1.5 size-4 text-secondary sm:mb-2 sm:size-5" name={block.icon} />
                  )}
                  <h3 className="text-[10px] font-black uppercase tracking-wide text-secondary sm:text-xs">{block.label && <RichContent content={block.label} />}</h3>
                  <p className="mt-1 line-clamp-2 text-[11px] font-semibold leading-4 text-white/80 sm:text-xs sm:leading-5">{block.value && <RichContent content={block.value} />}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 max-w-2xl text-base font-semibold leading-7 text-white/80 animate-[heroRise_0.95s_ease-out_both] sm:mt-7 sm:text-xl sm:leading-8">
            {seoSlide.copy && <RichContent content={seoSlide.copy} />}
          </div>

          <div className="mt-7 grid gap-3 animate-[heroRise_1.05s_ease-out_both] min-[420px]:flex min-[420px]:flex-wrap sm:mt-9">
            {seoSlide.primaryLabel ? (
              <SmartLink className="inline-flex min-h-12 items-center justify-center rounded-full bg-secondary px-6 text-xs font-black uppercase tracking-wide text-primary shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:bg-white sm:min-h-13 sm:px-7 sm:text-sm" href={seoSlide.primaryHref || "/services"}>
                {seoSlide.primaryLabel}
                <FaIcon className="ml-2 size-3.5" name="arrowRight" />
              </SmartLink>
            ) : null}
            {seoSlide.secondaryLabel ? (
              <SmartLink className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 text-xs font-black uppercase tracking-wide text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white hover:text-primary sm:min-h-13 sm:px-7 sm:text-sm" href={seoSlide.secondaryHref || "/contact"}>
                {seoSlide.secondaryLabel}
              </SmartLink>
            ) : null}
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-20 flex w-[min(1180px,calc(100%-24px))] -translate-x-1/2 items-center justify-between gap-5 sm:bottom-8 sm:w-[min(1180px,calc(100%-32px))]">
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
