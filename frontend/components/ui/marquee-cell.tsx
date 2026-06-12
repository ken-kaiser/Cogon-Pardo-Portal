"use client";

import { useRef, useEffect, useState } from "react";

interface MarqueeCellProps {
  text: string;
  maxWidth?: number; // px threshold before scrolling kicks in
  className?: string;
}

/**
 * Renders text normally when it fits. When the text overflows,
 * it smoothly slides left on hover so the full value is readable.
 */
export function MarqueeCell({ text, maxWidth = 120, className = "" }: MarqueeCellProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const span = textRef.current;
    if (container && span) {
      setOverflows(span.scrollWidth > container.clientWidth);
    }
  }, [text]);

  return (
    <div
      ref={containerRef}
      className={`group/marquee relative overflow-hidden ${className}`}
      style={{ maxWidth }}
    >
      <span
        ref={textRef}
        className={`inline-block whitespace-nowrap transition-transform duration-[2000ms] ease-linear ${
          overflows ? "group-hover/marquee:-translate-x-[var(--scroll-distance)]" : ""
        }`}
        style={
          overflows
            ? ({
                "--scroll-distance": `${(textRef.current?.scrollWidth ?? 0) - (containerRef.current?.clientWidth ?? 0) + 8}px`,
              } as React.CSSProperties)
            : undefined
        }
      >
        {text}
      </span>
    </div>
  );
}
