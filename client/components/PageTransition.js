"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const shell = useRef(null);
  const bar = useRef(null);

  useEffect(() => {
    if (!shell.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(bar.current, { scaleX: 0, autoAlpha: 1 });
      gsap.to(bar.current, {
        scaleX: 1,
        duration: 0.42,
        ease: "power3.out",
        onComplete: () => gsap.to(bar.current, { autoAlpha: 0, duration: 0.16, ease: "power2.out" })
      });

      gsap.fromTo(
        shell.current,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.32, ease: "power2.out", clearProps: "transform,opacity,visibility" }
      );
    }, shell);

    return () => ctx.revert();
  }, [pathname]);

  return (
    <>
      <div ref={bar} className="fixed left-0 top-0 z-[80] h-0.5 w-full origin-left scale-x-0 bg-secondary opacity-0" />
      <div ref={shell} key={pathname}>
        {children}
      </div>
    </>
  );
}
