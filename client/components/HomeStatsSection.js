"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import FaIcon from "@/components/FaIcon";

function parseStatValue(value) {
  const text = String(value || "");
  const match = text.match(/[\d,.]+/);

  if (!match) {
    return { target: 0, prefix: "", suffix: text, decimals: 0 };
  }

  const numericText = match[0];
  const decimals = numericText.includes(".") ? numericText.split(".")[1].length : 0;
  const target = Number(numericText.replace(/,/g, ""));

  return {
    target: Number.isFinite(target) ? target : 0,
    prefix: text.slice(0, match.index),
    suffix: text.slice((match.index || 0) + numericText.length),
    decimals
  };
}

function formatStatValue(value, decimals) {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  });
}

function CountingNumber({ value }) {
  const ref = useRef(null);
  const [{ current, started }, setCount] = useState({ current: 0, started: false });
  const parsed = useMemo(() => parseStatValue(value), [value]);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCount((state) => ({ ...state, started: true }));
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) {
      return undefined;
    }

    let frame = 0;
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount({ current: parsed.target * eased, started: true });

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    }

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [parsed.target, started]);

  return (
    <span ref={ref}>
      {parsed.prefix}
      {formatStatValue(current, parsed.decimals)}
      {parsed.suffix}
    </span>
  );
}

export default function HomeStatsSection({ stats = [] }) {
  const visibleStats = stats.filter((item) => item.enabled !== false);

  if (visibleStats.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-[#fffdfb] pb-10 pt-10 sm:pb-14 sm:pt-14" aria-label="Firm highlights" data-reveal="up">
      <div className="pointer-events-none absolute left-[7%] top-0 hidden h-44 w-8 -translate-y-24 rounded-full bg-primary/5 sm:block" />
      <div className="pointer-events-none absolute left-[10%] top-0 hidden h-52 w-8 -translate-y-32 rounded-full bg-primary/5 sm:block" />
      <div className="pointer-events-none absolute bottom-0 right-[7%] hidden h-40 w-8 translate-y-12 rounded-full bg-primary/5 sm:block" />
      <div className="pointer-events-none absolute bottom-0 right-[10%] hidden h-52 w-8 translate-y-20 rounded-full bg-primary/5 sm:block" />

      <div className="relative z-10 mx-auto grid w-[min(1180px,calc(100%-32px))] gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visibleStats.map((item, index) => (
          <article
            className="group grid min-h-56 place-items-center rounded-lg border border-primary/5 bg-white px-6 py-9 text-center shadow-2xl shadow-primary/8 transition duration-300 hover:-translate-y-2 hover:border-primary/15 hover:shadow-primary/15"
            data-reveal="zoom"
            key={`${item.label}-${index}`}
          >
            <div>
              <span className="mx-auto grid h-28 w-36 place-items-center text-primary transition duration-300 group-hover:scale-110 group-hover:text-secondary">
                <FaIcon className="!h-15 !w-24 text-[5rem]" name={item.icon || "scale"} />
              </span>
              <strong className="mt-4 block text-3xl font-black leading-none text-ink sm:text-3xl">
                <CountingNumber value={item.value} />
              </strong>
              <p className="mt-3 text-sm font-bold text-muted">{item.label}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
