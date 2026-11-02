import type { ReactNode } from "react";

export default function PageIntro({ label, title, description, children }: {
  label?: string; title: string; description?: string; children?: ReactNode;
}) {
  return (
    <section className="border-b border-gold-100 bg-linear-to-br from-gold-50 via-white to-white">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        {label && <p className="mb-5 inline-flex rounded-full bg-gold-100 px-4 py-1.5 text-sm font-semibold text-gold-700">{label}</p>}
        <h1 className="max-w-4xl text-4xl leading-tight text-gray-900 sm:text-5xl lg:text-6xl">{title}</h1>
        {description && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">{description}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
