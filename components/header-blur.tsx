"use client";

import { useEffect, useState } from "react";

export default function HeaderBlur() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={
        `pointer-events-none absolute inset-0 -z-10 transition-all ` +
        (scrolled
          ? "bg-background/60 backdrop-blur supports-[backdrop-filter]:backdrop-blur"
          : "bg-transparent")
      }
    />
  );
}
