"use client";

import { useEffect, useState } from "react";

export function useViewport() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    let rAFId: number;

    const handleResize = () => {
      cancelAnimationFrame(rAFId);
      rAFId = requestAnimationFrame(() => {
        setWidth(window.innerWidth);
      });
    };

    window.addEventListener("resize", handleResize, { passive: true });
    // Initialize immediately
    handleResize();

    return () => {
      cancelAnimationFrame(rAFId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  return { width, isMobile, isTablet, isDesktop };
}
