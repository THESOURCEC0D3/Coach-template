"use client";

import { useEffect, useRef, useState } from "react";

// Scroll-triggered fade-in wrapper. Drop-in replacement for the previous
// framer-motion version — same prop API, but uses the browser's native
// IntersectionObserver + CSS transitions. Removes ~50KB of JS from the bundle
// and ~7s of main-thread work on mobile.
export default function FadeInUp({
  children,
  delay = 0,
  duration = 1,
  amount = 0.1,
  className = "",
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Respect users who prefer reduced motion — show content immediately
    // with no animation. Accessibility win + bypasses observer entirely.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // fire once, then stop watching
        }
      },
      { threshold: amount }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [amount]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
