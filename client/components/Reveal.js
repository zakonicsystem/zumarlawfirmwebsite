"use client";

import { useEffect } from "react";

export default function Reveal() {
  useEffect(() => {
    const pageLoadItems = document.querySelectorAll("[data-page-load]");
    pageLoadItems.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${index * 80}ms`);
      item.classList.add("is-visible");
    });

    const revealItems = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );

    revealItems.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${(index % 3) * 45}ms`);
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
