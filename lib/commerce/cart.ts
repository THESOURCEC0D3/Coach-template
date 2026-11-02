import "server-only";
import { cookies } from "next/headers";
import { medusa, CommerceError } from "./client";
import type { Cart, Customer, Order, Entitlement } from "./types";

const cartFields = "*items,*items.variant,*items.variant.product,*shipping_address,*shipping_methods,*promotions,*payment_collection.payment_sessions";

export async function getCart(): Promise<Cart | null> {
  const id = (await cookies()).get("trophy_cart")?.value;
  if (!id || !/^cart_[a-zA-Z0-9]+$/.test(id)) return null;
  try { return (await medusa<{ cart: Cart }>(`/store/carts/${id}?fields=${encodeURIComponent(cartFields)}`, { authenticated: true })).cart; }
  catch (error) { if (error instanceof CommerceError && error.status === 404) return null; throw error; }
}

export async function getCustomer(): Promise<Customer | null> {
  if (!(await cookies()).get("trophy_customer")?.value) return null;
  try { return (await medusa<{ customer: Customer }>("/store/customers/me", { authenticated: true })).customer; }
  catch (error) { if (error instanceof CommerceError && [401, 403].includes(error.status)) return null; throw error; }
}

export async function getOrders(): Promise<Order[]> {
  return (await medusa<{ orders: Order[] }>("/store/orders?fields=id,display_id,email,currency_code,total,created_at,status,payment_status,fulfillment_status,*items&limit=50", { authenticated: true })).orders;
}

export async function getDownloads(): Promise<Entitlement[]> {
  return (await medusa<{ downloads: Entitlement[] }>("/store/downloads", { authenticated: true })).downloads;
}

export async function getOrder(id: string): Promise<Order | null> {
  if (!/^order_[a-zA-Z0-9]+$/.test(id)) return null;
  const capability = (await cookies()).get(`trophy_order_${id}`)?.value;
  try { const result = await medusa<{ order: Order; downloads: Entitlement[] }>(`/store/book-orders/${id}`, { authenticated: true, headers: capability ? { "x-order-capability": capability } : undefined }); return { ...result.order, downloads: result.downloads }; }
  catch (error) { if (error instanceof CommerceError && [401, 403, 404].includes(error.status)) return null; throw error; }
}
