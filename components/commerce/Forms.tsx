"use client";

import { startTransition, useActionState, useEffect, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addToCart, updateCart, applyDiscount, saveCheckout, chooseShipping, signIn, register, requestDownload, requestOrderDownload, beginPayment, completeCheckout } from "@/lib/commerce/actions";
import { money } from "@/lib/commerce/helpers";
import type { ActionResult, BookVariant, Cart, CartItem, Entitlement } from "@/lib/commerce/types";

const initial: ActionResult = {};
const inputClass = "mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gold-700 focus:ring-2 focus:ring-gold-200";
const buttonClass = "inline-flex items-center justify-center rounded-full bg-gold-700 px-6 py-3 font-semibold text-white transition hover:bg-gold-800 disabled:cursor-not-allowed disabled:opacity-50";
const subscribeReady = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

function Result({ state }: { state: ActionResult }) {
  return <div aria-live="polite" className="text-sm">{state.error && <p role="alert" className="mt-3 text-red-800">{state.error}</p>}{state.success && <p className="mt-3 text-gold-800">{state.success}</p>}</div>;
}

export function QuickAddToCart({ variantId }: { variantId: string }) {
  const [state, action, pending] = useActionState(addToCart, initial);
  return <form action={action}>
    <input type="hidden" name="variant_id" value={variantId} />
    <input type="hidden" name="quantity" value="1" />
    <button type="submit" className={`${buttonClass} w-full`} disabled={pending}>{pending ? "Adding…" : "Add to Cart"}</button>
    <Result state={state} />
    {state.success && <Link href="/cart" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-gold-700 underline underline-offset-4">View your cart →</Link>}
  </form>;
}

export function AddToBag({ variants }: { variants: BookVariant[] }) {
  const [state, action, pending] = useActionState(addToCart, initial);
  const saleable = variants.filter((variant) => variant.price !== null && variant.available);
  if (!saleable.length) return <p className="rounded-2xl bg-gray-50 p-5 text-gray-600">This book is not currently available to purchase.</p>;
  return <form action={action} className="space-y-5"><label className="block text-sm font-semibold">Choose an edition<select name="variant_id" className={inputClass} required>{saleable.map((variant) => <option key={variant.id} value={variant.id}>{variant.title} · {variant.format.toUpperCase()} · {money(variant.price!, variant.currency)}</option>)}</select></label><label className="block max-w-32 text-sm font-semibold">Quantity<input className={inputClass} name="quantity" type="number" min="1" max="20" defaultValue="1" required /></label><button className={buttonClass} disabled={pending}>{pending ? "Adding…" : "Add to Cart"}</button><Result state={state} />{state.success && <Link href="/cart" className="inline-block font-semibold text-gold-700 underline underline-offset-4">View your bag →</Link>}</form>;
}

export function CartItemForm({ item }: { item: CartItem }) {
  const [state, action, pending] = useActionState(updateCart, initial);
  const router = useRouter();
  const ready = useSyncExternalStore(subscribeReady, clientReady, serverReady);
  useEffect(() => { if (state.success) router.refresh(); }, [router, state]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    if (submitter instanceof HTMLButtonElement && submitter.name === "remove") data.set("remove", "true");
    startTransition(() => action(data));
  }
  return <form onSubmit={submit} method="post" className="mt-4"><input type="hidden" name="item_id" value={item.id} /><div className="flex flex-wrap items-end gap-3"><label className="text-sm">Quantity<input aria-label={`Quantity for ${item.title}`} className={`${inputClass} max-w-24`} name="quantity" type="number" min="1" max="20" defaultValue={item.quantity} disabled={!ready || pending} required /></label><button className="rounded-full border border-gold-200 px-4 py-3 text-sm font-semibold text-gold-700 disabled:opacity-50" disabled={!ready || pending}>Update</button><button className="px-2 py-3 text-sm text-gray-600 underline" name="remove" value="true" formNoValidate disabled={!ready || pending}>Remove</button></div><Result state={state} /></form>;
}

export function DiscountForm() {
  const [state, action, pending] = useActionState(applyDiscount, initial);
  return <form action={action} className="mt-6 border-t border-gray-200 pt-6"><label className="text-sm font-semibold" htmlFor="discount">Have a discount code?</label><div className="mt-2 flex gap-2"><input id="discount" name="code" maxLength={80} required className="min-w-0 flex-1 rounded-xl border border-gray-300 px-3 py-2" /><button className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" disabled={pending}>{pending ? "Checking…" : "Apply"}</button></div><Result state={state} /></form>;
}

export function CheckoutForm({ cart, physical }: { cart: Cart; physical: boolean }) {
  const [state, action, pending] = useActionState(saveCheckout, initial);
  const address = cart.shipping_address || {};
  return <form action={action} className="space-y-5"><h2 className="text-2xl text-gray-900">Your details</h2><label className="block text-sm font-semibold">Email address<input className={inputClass} type="email" name="email" defaultValue={cart.email} autoComplete="email" required maxLength={254} /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">First name<input className={inputClass} name="first_name" autoComplete="given-name" defaultValue={address.first_name} maxLength={100} required /></label><label className="block text-sm font-semibold">Last name<input className={inputClass} name="last_name" autoComplete="family-name" defaultValue={address.last_name} maxLength={100} required /></label></div><label className="block text-sm font-semibold">Phone number<input className={inputClass} name="phone" type="tel" autoComplete="tel" defaultValue={address.phone} maxLength={25} required /></label>{physical ? <fieldset className="space-y-4"><legend className="mb-3 text-lg font-semibold">Delivery address · Kenya</legend><label className="block text-sm font-semibold">Street address<input className={inputClass} name="address_1" defaultValue={address.address_1} autoComplete="street-address" required maxLength={200} /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Town / city<input className={inputClass} name="city" defaultValue={address.city} autoComplete="address-level2" maxLength={100} required /></label><label className="block text-sm font-semibold">Postal code (optional)<input className={inputClass} name="postal_code" defaultValue={address.postal_code} autoComplete="postal-code" maxLength={30} /></label></div></fieldset> : <><input type="hidden" name="address_1" value="" /><input type="hidden" name="city" value="" /><input type="hidden" name="postal_code" value="" /><p className="rounded-2xl bg-gold-50 p-4 text-sm text-gold-900">Your bag contains digital editions only. No delivery address or shipping charge is needed. Downloads become available after confirmed payment.</p></>}<button className={buttonClass} disabled={pending}>{pending ? "Saving…" : "Save details"}</button><Result state={state} /></form>;
}

export function ShippingForm({ options }: { options: { id: string; name: string; amount: number }[] }) {
  const [state, action, pending] = useActionState(chooseShipping, initial);
  if (!options.length) return <p className="text-sm text-gray-600">Save your delivery address to see available delivery options. If none appear, please contact Trophy for delivery arrangements.</p>;
  return <form action={action} className="space-y-4"><fieldset className="space-y-3"><legend className="mb-3 font-semibold">Choose delivery</legend>{options.map((option) => <label key={option.id} className="flex items-center gap-3 rounded-xl border border-gray-200 p-4"><input name="option_id" type="radio" value={option.id} required /><span className="flex-1">{option.name}</span><span>{money(option.amount)}</span></label>)}</fieldset><button className={buttonClass} disabled={pending}>{pending ? "Saving…" : "Save delivery"}</button><Result state={state} /></form>;
}

export function CustomerForms() {
  const [loginState, loginAction, loginPending] = useActionState(signIn, initial);
  const [registerState, registerAction, registerPending] = useActionState(register, initial);
  return <div className="grid gap-8 md:grid-cols-2"><form action={loginAction} className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm"><h2 className="text-2xl">Welcome back</h2><p className="mt-2 text-sm text-gray-500">Sign in to view your orders and digital library.</p><label className="mt-6 block text-sm font-semibold">Email address<input className={inputClass} name="email" type="email" autoComplete="email" required /></label><label className="mt-4 block text-sm font-semibold">Password<input className={inputClass} name="password" type="password" autoComplete="current-password" minLength={10} maxLength={128} required /></label><button className={`${buttonClass} mt-6`} disabled={loginPending}>{loginPending ? "Signing in…" : "Sign in"}</button><Result state={loginState} /></form><form action={registerAction} className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm"><h2 className="text-2xl">Create your account</h2><p className="mt-2 text-sm text-gray-500">Keep your purchases and reading in one place.</p><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">First name<input className={inputClass} name="first_name" autoComplete="given-name" maxLength={100} required /></label><label className="text-sm font-semibold">Last name<input className={inputClass} name="last_name" autoComplete="family-name" maxLength={100} required /></label></div><label className="mt-4 block text-sm font-semibold">Email address<input className={inputClass} name="email" type="email" autoComplete="email" required /></label><label className="mt-4 block text-sm font-semibold">Password <span className="font-normal text-gray-500">(10 characters minimum)</span><input className={inputClass} name="password" type="password" autoComplete="new-password" minLength={10} maxLength={128} required /></label><p className="mt-4 text-xs leading-relaxed text-gray-500">By creating an account, you agree to the <Link href="/terms" className="underline">terms</Link>. Read how your information is handled in the <Link href="/privacy" className="underline">privacy policy</Link>.</p><button className={`${buttonClass} mt-5`} disabled={registerPending}>{registerPending ? "Creating…" : "Create account"}</button><Result state={registerState} /></form></div>;
}

export function DownloadForm({ entitlement, orderId }: { entitlement: Entitlement; orderId?: string }) {
  const [state, action, pending] = useActionState(orderId ? requestOrderDownload : requestDownload, initial);
  const available = !entitlement.revoked_at && entitlement.grant_count < entitlement.download_limit;
  return <form action={action}><input type="hidden" name="entitlement_id" value={entitlement.id} />{orderId && <input type="hidden" name="order_id" value={orderId} />}<button className={`${buttonClass} text-sm`} disabled={pending || !available}>{pending ? "Preparing…" : available ? `Download ${entitlement.format.toUpperCase()}` : entitlement.revoked_at ? "Access revoked" : "Download limit reached"}</button><Result state={state} /></form>;
}

export function PaymentForm({ providers }: { providers: { id: string }[] }) {
  const [state, action, pending] = useActionState(beginPayment, initial);
  return <form action={action} className="space-y-4"><label className="block text-sm font-semibold">Payment option<select name="provider_id" className={inputClass} required>{providers.map((provider) => <option key={provider.id} value={provider.id}>{provider.id.includes("paystack") ? "M-Pesa or card" : "Secure online payment"}</option>)}</select></label><button className={buttonClass} disabled={pending}>{pending ? "Preparing secure checkout…" : "Continue to secure payment"}</button><Result state={state} /><p className="text-xs leading-relaxed text-gray-500">Your order and downloads are confirmed only after the payment provider verifies successful payment.</p></form>;
}

export function CompleteOrderForm() {
  const [state, action, pending] = useActionState(completeCheckout, initial);
  return <form action={action} className="mt-6 border-t border-gray-100 pt-6"><p className="mb-4 text-sm text-gray-500">Already completed payment? Check its status and finish your order.</p><button className={buttonClass} disabled={pending}>{pending ? "Verifying with payment provider…" : "Verify payment and place order"}</button><Result state={state} /></form>;
}
