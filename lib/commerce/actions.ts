"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { medusa, cartCookieOptions, customerCookieOptions } from "./client";
import { getCart } from "./cart";
import { getRegion } from "./catalog";
import { needsShipping, validQuantity } from "./helpers";
import { createOrderCapability } from "./order-access";
import type { ActionResult, Cart, Customer, Order } from "./types";

function failure(error: unknown): ActionResult { return { error: error instanceof Error ? error.message : "Please try again." }; }
function id(value: FormDataEntryValue | null, prefix: string) {
  if (typeof value !== "string" || !new RegExp(`^${prefix}_[a-zA-Z0-9]+$`).test(value)) throw new Error("Please choose a valid item.");
  return value;
}

export async function addToCart(_previous: ActionResult, data: FormData): Promise<ActionResult> {
  try {
    const variantId = id(data.get("variant_id"), "variant");
    const quantity = validQuantity(data.get("quantity") || "1");
    // This catalogue lookup also rejects variants outside the publishable sales channel.
    const { products } = await medusa<{ products: { variants: { id: string }[] }[] }>(`/store/products?variants[id]=${encodeURIComponent(variantId)}&fields=*variants&limit=1`);
    if (!products.some((product) => product.variants.some((variant) => variant.id === variantId))) throw new Error("This edition is not available in the bookstore.");
    let cart = await getCart();
    if (!cart) {
      const region = await getRegion();
      cart = (await medusa<{ cart: Cart }>("/store/carts", { method: "POST", authenticated: true, body: { region_id: region.id } })).cart;
      (await cookies()).set("trophy_cart", cart.id, cartCookieOptions);
    }
    await medusa(`/store/carts/${cart.id}/line-items`, { method: "POST", authenticated: true, body: { variant_id: variantId, quantity } });
    revalidatePath("/cart");
    return { success: "Added to your book bag." };
  } catch (error) { return failure(error); }
}

export async function updateCart(_previous: ActionResult, data: FormData): Promise<ActionResult> {
  try {
    const cart = await getCart();
    if (!cart) throw new Error("Your bag is empty.");
    const itemId = id(data.get("item_id"), "cali");
    if (!cart.items.some((item) => item.id === itemId)) throw new Error("This item is not in your bag.");
    if (data.get("remove") === "true") await medusa(`/store/carts/${cart.id}/line-items/${itemId}`, { method: "DELETE", authenticated: true });
    else await medusa(`/store/carts/${cart.id}/line-items/${itemId}`, { method: "POST", authenticated: true, body: { quantity: validQuantity(data.get("quantity")) } });
    revalidatePath("/cart"); revalidatePath("/checkout");
    return { success: "Your bag has been updated." };
  } catch (error) { return failure(error); }
}

export async function applyDiscount(_previous: ActionResult, data: FormData): Promise<ActionResult> {
  try {
    const cart = await getCart(); if (!cart) throw new Error("Your bag is empty.");
    const code = z.string().trim().min(1).max(80).parse(data.get("code"));
    await medusa(`/store/carts/${cart.id}`, { method: "POST", authenticated: true, body: { promo_codes: [code] } });
    revalidatePath("/cart"); revalidatePath("/checkout");
    return { success: "Discount checked and totals updated." };
  } catch (error) { return failure(error); }
}

const checkoutSchema = z.object({ email: z.email().max(254), first_name: z.string().trim().min(1).max(100), last_name: z.string().trim().min(1).max(100), phone: z.string().trim().min(7).max(25), address_1: z.string().trim().max(200), city: z.string().trim().max(100), postal_code: z.string().trim().max(30) });

export async function saveCheckout(_previous: ActionResult, data: FormData): Promise<ActionResult> {
  try {
    const cart = await getCart(); if (!cart?.items.length) throw new Error("Add a book to your bag first.");
    const parsed = checkoutSchema.safeParse(Object.fromEntries(data));
    if (!parsed.success) return { error: "Check your email, name and phone number." };
    const values = parsed.data;
    if (needsShipping(cart.items) && (!values.address_1 || !values.city)) return { error: "A street address and town/city are required for physical books." };
    const { email, ...address } = values;
    await medusa(`/store/carts/${cart.id}`, { method: "POST", authenticated: true, body: { email, ...(needsShipping(cart.items) ? { shipping_address: { ...address, country_code: "ke" }, billing_address: { ...address, country_code: "ke" } } : {}) } });
    revalidatePath("/checkout");
    return { success: "Your details have been saved." };
  } catch (error) { return failure(error); }
}

export async function chooseShipping(_previous: ActionResult, data: FormData): Promise<ActionResult> {
  try {
    const cart = await getCart(); if (!cart) throw new Error("Your bag is empty.");
    const optionId = id(data.get("option_id"), "so");
    const { shipping_options } = await medusa<{ shipping_options: { id: string }[] }>(`/store/shipping-options?cart_id=${cart.id}`);
    if (!shipping_options.some((option) => option.id === optionId)) throw new Error("That delivery option is not available.");
    await medusa(`/store/carts/${cart.id}/shipping-methods`, { method: "POST", authenticated: true, body: { option_id: optionId } });
    revalidatePath("/checkout"); return { success: "Delivery option saved." };
  } catch (error) { return failure(error); }
}

const credentials = z.object({ email: z.email().max(254), password: z.string().min(10).max(128) });

export async function signIn(_previous: ActionResult, data: FormData): Promise<ActionResult> {
  try {
    const parsed = credentials.safeParse(Object.fromEntries(data));
    if (!parsed.success) return { error: "Enter your email and a password of at least 10 characters." };
    const { token } = await medusa<{ token: string }>("/auth/customer/emailpass", { method: "POST", body: parsed.data });
    (await cookies()).set("trophy_customer", token, customerCookieOptions);
    const cart = await getCart();
    if (cart) await medusa(`/store/carts/${cart.id}/customer`, { method: "POST", token }).catch(() => undefined);
    revalidatePath("/account");
  } catch { return { error: "We could not sign you in. Check your credentials and try again." }; }
  redirect("/account");
}

export async function register(_previous: ActionResult, data: FormData): Promise<ActionResult> {
  try {
    const parsed = credentials.extend({ first_name: z.string().trim().min(1).max(100), last_name: z.string().trim().min(1).max(100) }).safeParse(Object.fromEntries(data));
    if (!parsed.success) return { error: "Enter your name, valid email and a password of at least 10 characters." };
    const { email, password, first_name, last_name } = parsed.data;
    const registration = await medusa<{ token: string }>("/auth/customer/emailpass/register", { method: "POST", body: { email, password } });
    await medusa<{ customer: Customer }>("/store/customers", { method: "POST", token: registration.token, body: { email, first_name, last_name } });
    const { token } = await medusa<{ token: string }>("/auth/customer/emailpass", { method: "POST", body: { email, password } });
    (await cookies()).set("trophy_customer", token, customerCookieOptions);
    const cart = await getCart();
    if (cart) await medusa(`/store/carts/${cart.id}/customer`, { method: "POST", token }).catch(() => undefined);
    revalidatePath("/account");
  } catch { return { error: "We could not create your account. If you already have an account, please sign in." }; }
  redirect("/account");
}

export async function signOut() {
  const jar = await cookies(); jar.delete("trophy_customer"); jar.delete("trophy_cart");
  revalidatePath("/account"); redirect("/account");
}

export async function requestDownload(_previous: ActionResult, data: FormData): Promise<ActionResult> {
  let target: string;
  try {
    const downloadId = id(data.get("entitlement_id"), "dent");
    const { url } = await medusa<{ url: string }>(`/store/downloads/${downloadId}`, { method: "POST", authenticated: true });
    const parsed = new URL(url);
    if (!["https:", ...(process.env.NODE_ENV !== "production" ? ["http:"] : [])].includes(parsed.protocol)) throw new Error("The download could not be prepared.");
    target = parsed.toString();
  } catch (error) { return failure(error); }
  redirect(target);
}

export async function requestOrderDownload(_previous: ActionResult, data: FormData): Promise<ActionResult> {
  let target: string;
  try {
    const orderId = id(data.get("order_id"), "order");
    const downloadId = id(data.get("entitlement_id"), "dent");
    const capability = (await cookies()).get(`trophy_order_${orderId}`)?.value;
    const { url } = await medusa<{ url: string }>(`/store/book-orders/${orderId}/downloads/${downloadId}`, { method: "POST", authenticated: true, headers: capability ? { "x-order-capability": capability } : undefined });
    const parsed = new URL(url);
    if (!["https:", ...(process.env.NODE_ENV !== "production" ? ["http:"] : [])].includes(parsed.protocol)) throw new Error("The download could not be prepared.");
    target = parsed.toString();
  } catch (error) { return failure(error); }
  redirect(target);
}

export async function beginPayment(_previous: ActionResult, data: FormData): Promise<ActionResult> {
  let target: string;
  try {
    const cart = await getCart(); if (!cart?.email) throw new Error("Save your checkout details first.");
    if (!process.env.ORDER_ACCESS_SECRET) throw new Error("Secure order access is being configured. No payment has been taken.");
    if (needsShipping(cart.items) && !cart.shipping_methods?.length) throw new Error("Choose a delivery option first.");
    const providerId = z.string().min(1).max(120).parse(data.get("provider_id"));
    const { payment_providers } = await medusa<{ payment_providers: { id: string }[] }>(`/store/payment-providers?region_id=${cart.region_id}`);
    if (providerId === "pp_system_default" || !payment_providers.some((provider) => provider.id === providerId)) throw new Error("Online payments are not available yet. Please contact Trophy about your purchase.");
    const collectionId = cart.payment_collection?.id || (await medusa<{ payment_collection: { id: string } }>("/store/payment-collections", { method: "POST", body: { cart_id: cart.id } })).payment_collection.id;
    const { payment_collection } = await medusa<{ payment_collection: { payment_sessions: { data?: { authorization_url?: string; checkout_url?: string } }[] } }>(`/store/payment-collections/${collectionId}/payment-sessions`, { method: "POST", authenticated: true, body: { provider_id: providerId } });
    const session = payment_collection.payment_sessions[0];
    const url = session?.data?.authorization_url || session?.data?.checkout_url;
    if (!url) throw new Error("This payment option needs further setup. No payment has been taken.");
    const parsed = new URL(url);
    const hosts = (process.env.PAYMENT_REDIRECT_HOSTS || "checkout.paystack.com").split(",");
    if (parsed.protocol !== "https:" || !hosts.includes(parsed.hostname)) throw new Error("The payment link could not be verified.");
    target = parsed.toString();
  } catch (error) { return failure(error); }
  redirect(target);
}

export async function completeCheckout(_previous: ActionResult): Promise<ActionResult> {
  let orderId: string;
  try {
    const cart = await getCart();
    if (!process.env.ORDER_ACCESS_SECRET) throw new Error("Secure order access is being configured. No order has been placed.");
    if (!cart?.email || !cart.payment_collection?.payment_sessions?.length) throw new Error("Complete the secure payment step first.");
    if (cart.payment_collection.payment_sessions.every((session) => session.provider_id === "pp_system_default")) throw new Error("Online payments have not been configured. No order has been placed.");
    // Medusa invokes the payment provider server-side. The browser supplies no payment result.
    const result = await medusa<{ type: "order"; order: Order } | { type: "cart"; error?: { message?: string } }>(`/store/carts/${cart.id}/complete`, { method: "POST", authenticated: true, body: {} });
    if (result.type !== "order") throw new Error(result.error?.message || "Payment is still pending. Please check again shortly.");
    orderId = result.order.id;
    const jar = await cookies();
    jar.set(`trophy_order_${orderId}`, createOrderCapability(orderId), { ...cartCookieOptions, maxAge: 30 * 24 * 60 * 60 });
    jar.delete("trophy_cart");
    revalidatePath("/account"); revalidatePath("/cart");
  } catch (error) { return failure(error); }
  redirect(`/orders/${orderId}`);
}
