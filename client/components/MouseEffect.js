"use client";

import { useEffect, useRef } from "react";

export default function MouseEffect() {
  const wrap = useRef(null);
  const dot = useRef(null);
  const ring = useRef(null);
  const target = useRef({ x: -80, y: -80 });
  const current = useRef({ x: -80, y: -80, ringX: -80, ringY: -80 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frame = 0;

    const move = (event) => {
      target.current.x = event.clientX;
      target.current.y = event.clientY;

      if (wrap.current) {
        wrap.current.style.opacity = "1";
      }
    };

    const tick = () => {
      const point = target.current;
      const position = current.current;

      position.x += (point.x - position.x) * 0.34;
      position.y += (point.y - position.y) * 0.34;
      position.ringX += (point.x - position.ringX) * 0.18;
      position.ringY += (point.y - position.ringY) * 0.18;

      if (dot.current) {
        dot.current.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`;
      }

      if (ring.current) {
        ring.current.style.transform = `translate3d(${position.ringX}px, ${position.ringY}px, 0) translate(-50%, -50%)`;
      }

      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={wrap} className="pointer-events-none fixed inset-0 z-[60] opacity-0 transition-opacity duration-200">
      <span ref={ring} className="absolute left-0 top-0 size-7 rounded-full border border-primary/35 will-change-transform" />
      <span ref={dot} className="absolute left-0 top-0 size-1.5 rounded-full bg-secondary shadow-[0_0_14px_rgba(239,218,199,0.7)] will-change-transform" />
    </div>
  );
}
