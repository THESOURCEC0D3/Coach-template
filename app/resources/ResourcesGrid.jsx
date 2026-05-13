"use client";

import { useState } from "react";
import ContentCard from "@/components/ContentCard";

// Filter the shared content array by type. "All" shows everything.
// Filters are derived dynamically from the content array, so adding a new
// `type` value (e.g., "Newsletter") automatically adds a filter pill.
function uniqueTypes(items) {
  const set = new Set(items.map((i) => i.type));
  return ["All", ...Array.from(set)];
}

export default function ResourcesGrid({ content }) {
  const [filter, setFilter] = useState("All");
  const types = uniqueTypes(content);
  const filtered =
    filter === "All" ? content : content.filter((i) => i.type === filter);

  return (
    <section className="max-w-6xl mx-auto px-4 pb-24">
      {/* Filter pills */}
      <div
        className="flex flex-wrap justify-center gap-2 mb-12"
        role="tablist"
        aria-label="Filter resources by type"
      >
        {types.map((type) => {
          const isActive = type === filter;
          return (
            <button
              key={type}
              role="tab"
              aria-selected={isActive}
              onClick={() => setFilter(type)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                isActive
                  ? "bg-violet-700 text-white"
                  : "bg-violet-100 text-violet-700 hover:bg-violet-200"
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <ContentCard key={item.href} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-12">
          Nothing here yet — check back soon.
        </p>
      )}
    </section>
  );
}
