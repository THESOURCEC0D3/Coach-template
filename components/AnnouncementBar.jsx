"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("announcement-dismissed");
    if (!dismissed) setIsVisible(true);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("announcement-dismissed", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-amber-400 text-gray-900 relative">
      <div className="max-w-6xl mx-auto px-4 py-2.5 pr-12 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm">
        <span>Free guide:</span>
        <Link
          href="#lead-magnet"
          className="font-bold underline underline-offset-2 hover:no-underline"
        >
          How to land your first 5 coaching clients →
        </Link>
      </div>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-900 hover:opacity-70 transition"
      >
        ✕
      </button>
    </div>
  );
}
