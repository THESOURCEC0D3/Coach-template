import type { MetadataRoute } from "next";
import { getSiteUrl, services } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return ["/", "/about", "/services", ...services.map(service => `/services/${service.slug}`), "/books", "/events", "/resources", "/media", "/the-brand-experts-kenya", "/contact", "/privacy", "/terms", "/refunds", "/delivery"].map(path => ({ url: new URL(path, base).toString(), changeFrequency: path === "/" ? "weekly" : "monthly", priority: path === "/" ? 1 : .7 }));
}
