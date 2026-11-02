import { connection } from "next/server";

/** Publish only approved content. These collections deliberately contain no demo claims. */
export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Communication" | "Leadership" | "Personal growth";
  publishedAt: string;
  paragraphs: string[];
};

export type Workshop = {
  slug: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt?: string;
  location: string;
  format: "In person" | "Online" | "Hybrid";
  topics: string[];
  registrationOpen: boolean;
};

export type MediaEntry = {
  id: string;
  title: string;
  description: string;
  href: string;
  kind: "Interview" | "Video" | "Photo gallery";
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role?: string;
  approved: boolean;
};

export const articles: Article[] = [];
export const events: Workshop[] = [];
export const workshops = events;
export const media: MediaEntry[] = [];
export const testimonials: Testimonial[] = [];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getWorkshop(slug: string) {
  return workshops.find((workshop) => workshop.slug === slug);
}

/** Evaluate time-sensitive registration state for the current server request. */
export async function getUpcomingWorkshops() {
  await connection();
  const now = Date.now();
  return workshops
    .filter((event) => new Date(event.endsAt ?? event.startsAt).getTime() >= now)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}

export async function isRegistrationOpen(event: Workshop) {
  await connection();
  return event.registrationOpen && new Date(event.endsAt ?? event.startsAt).getTime() >= Date.now();
}

export function formatEditorialDate(value: string, includeTime = false) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "long",
    ...(includeTime ? { timeStyle: "short" as const } : {}),
    timeZone: "Africa/Nairobi",
  }).format(new Date(value));
}
