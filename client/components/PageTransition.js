"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    const timer = window.setTimeout(() => setAnimating(false), 480);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <div className={`fixed left-0 top-0 z-[80] h-0.5 w-full origin-left bg-secondary ${animating ? "animate-route-progress" : "scale-x-0 opacity-0"}`} />
      <div className="animate-route-shell" key={pathname}>
        {children}
      </div>
    </>
  );
}
