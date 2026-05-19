"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Reveal() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const page = gsap.context(() => {
      gsap.fromTo(
        "[data-page-load]",
        { autoAlpha: 0, y: 26, filter: "blur(10px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.95,
          stagger: 0.12,
          ease: "power3.out",
        }
      );

      gsap.utils.toArray("[data-reveal]").forEach((item, index) => {
        const type = item.dataset.reveal || "up";
        const from = {
          up: { y: 56, x: 0, rotate: 0 },
          left: { y: 0, x: -56, rotate: -1.5 },
          right: { y: 0, x: 56, rotate: 1.5 },
          zoom: { y: 20, x: 0, rotate: 0, scale: 0.94 }
        }[type] || { y: 56, x: 0, rotate: 0 };

        gsap.fromTo(
          item,
          { autoAlpha: 0, ...from },
          {
            autoAlpha: 1,
            y: 0,
            x: 0,
            rotate: 0,
            scale: 1,
            duration: 0.85,
            delay: (index % 3) * 0.04,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 82%",
              once: true
            }
          }
        );
      });
    });

    return () => page.revert();
  }, []);

  return null;
}
