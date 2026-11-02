import "server-only";
import { cache } from "react";
import { medusa, commerceConfig } from "./client";
import { bookFormat } from "./helpers";
import type { Book } from "./types";

type Product = { id: string; handle: string; title: string; subtitle?: string; description?: string; thumbnail?: string; metadata?: Record<string, unknown>; variants?: { id: string; title: string; metadata?: Record<string, unknown>; inventory_quantity?: number; manage_inventory?: boolean; allow_backorder?: boolean; calculated_price?: { calculated_amount: number; currency_code: string } }[] };

function normalize(product: Product): Book {
  const metadata = product.metadata || {};
  return { id: product.id, handle: product.handle, title: product.title, subtitle: product.subtitle, availabilityNote: typeof metadata.availability_note === "string" ? metadata.availability_note : undefined, description: product.description || "", cover: product.thumbnail || null, author: typeof metadata.author === "string" ? metadata.author : undefined, isbn: typeof metadata.isbn === "string" ? metadata.isbn : undefined, publicationDate: typeof metadata.publication_date === "string" ? metadata.publication_date : undefined, variants: (product.variants || []).map((variant) => ({ id: variant.id, title: variant.title, format: bookFormat(variant.metadata), price: variant.calculated_price?.calculated_amount ?? null, currency: variant.calculated_price?.currency_code || "kes", available: !variant.manage_inventory || Boolean(variant.allow_backorder) || (variant.inventory_quantity ?? 0) > 0 })) };
}

export const getRegion = cache(async () => {
  const { regions } = await medusa<{ regions: { id: string; currency_code: string }[] }>("/store/regions");
  const region = regions.find((entry) => entry.currency_code.toLowerCase() === "kes");
  if (!region) throw new Error("The KES bookstore region is not configured.");
  return region;
});

export async function getBooks(query: { q?: string; format?: string } = {}): Promise<{ books: Book[]; available: boolean }> {
  if (!commerceConfig().available) return { books: [], available: false };
  try {
    const region = await getRegion();
    const params = new URLSearchParams({ region_id: region.id, limit: "100", fields: "id,handle,title,subtitle,description,thumbnail,metadata,*variants.calculated_price,variants.metadata,variants.inventory_quantity,variants.manage_inventory,variants.allow_backorder" });
    if (query.q?.trim()) params.set("q", query.q.trim().slice(0, 100));
    const { products } = await medusa<{ products: Product[] }>(`/store/products?${params}`);
    const books = products.map(normalize).filter((book) => !query.format || query.format === "all" || book.variants.some((variant) => variant.format === query.format));
    return { books, available: true };
  } catch { return { books: [], available: false }; }
}

export const getBook = cache(async (handle: string): Promise<Book | null> => {
  if (!commerceConfig().available) return null;
  const region = await getRegion();
  const params = new URLSearchParams({ handle, region_id: region.id, fields: "id,handle,title,subtitle,description,thumbnail,metadata,*variants.calculated_price,variants.metadata,variants.inventory_quantity,variants.manage_inventory,variants.allow_backorder" });
  const { products } = await medusa<{ products: Product[] }>(`/store/products?${params}`);
  return products[0] ? normalize(products[0]) : null;
});
