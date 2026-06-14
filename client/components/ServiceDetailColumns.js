"use client";

import { useEffect, useRef, useState } from "react";

export default function ServiceDetailColumns({ left, right }) {
  const rightRef = useRef(null);
  const [leftHeight, setLeftHeight] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const updateDesktop = () => setIsDesktop(media.matches);

    updateDesktop();
    media.addEventListener("change", updateDesktop);

    return () => media.removeEventListener("change", updateDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop || !rightRef.current) {
      setLeftHeight(null);
      return undefined;
    }

    const updateHeight = () => {
      if (rightRef.current) {
        setLeftHeight(Math.ceil(rightRef.current.getBoundingClientRect().height));
      }
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(rightRef.current);
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [isDesktop]);

  return (
    <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
      <div className="order-2 min-w-0 lg:order-1" style={leftHeight ? { height: leftHeight } : undefined}>
        {left}
      </div>
      <div ref={rightRef} className="order-1 min-w-0 lg:order-2">
        {right}
      </div>
    </div>
  );
}
