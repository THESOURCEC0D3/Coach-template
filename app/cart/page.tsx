import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import PageIntro from "@/components/site/PageIntro";
import EmptyState from "@/components/site/EmptyState";
import { CartItemForm, DiscountForm } from "@/components/commerce/Forms";
import { getCart } from "@/lib/commerce/cart";
import { money, needsShipping } from "@/lib/commerce/helpers";

export const metadata = { title: "Your Book Bag", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cart = await getCart().catch(() => null);
  return <main><PageIntro label="Your reading list" title="A little space for big ideas." description="Review the books in your bag before continuing to checkout." /><section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">{!cart?.items.length ? <div className="py-12 text-center"><ShoppingBag size={48} className="mx-auto mb-6 text-gold-300" aria-hidden="true" /><EmptyState title="Your book bag is empty" description="Discover the books and publications available from Trophy." href="/books" action="Explore the bookstore" /></div> : <div className="grid items-start gap-10 lg:grid-cols-[1fr_360px]"><div className="divide-y divide-gray-100 rounded-3xl border border-gray-100 bg-white px-6">{cart.items.map((item) => <article key={item.id} className="py-7"><div className="flex justify-between gap-5"><div><h2 className="text-xl">{item.title}</h2><p className="mt-2 text-sm text-gray-500">{money(item.unit_price, cart.currency_code)} each</p></div><p className="font-semibold">{money(item.total, cart.currency_code)}</p></div><CartItemForm item={item} /></article>)}</div><aside className="rounded-3xl border border-gold-100 bg-gold-50/60 p-7"><h2 className="text-2xl">Your order</h2><dl className="mt-6 space-y-3 text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd>{money(cart.subtotal, cart.currency_code)}</dd></div>{cart.discount_total > 0 && <div className="flex justify-between text-gold-700"><dt>Discount</dt><dd>−{money(cart.discount_total, cart.currency_code)}</dd></div>}<div className="flex justify-between"><dt>Delivery</dt><dd>{needsShipping(cart.items) ? "Calculated at checkout" : "Not required"}</dd></div>{cart.tax_total > 0 && <div className="flex justify-between"><dt>Tax</dt><dd>{money(cart.tax_total, cart.currency_code)}</dd></div>}<div className="flex justify-between border-t border-gold-100 pt-4 text-base font-semibold"><dt>Total before delivery</dt><dd>{money(cart.total - cart.shipping_total, cart.currency_code)}</dd></div></dl><Link href="/checkout" className="mt-7 flex items-center justify-center gap-2 rounded-full bg-gold-700 px-5 py-3 font-semibold text-white hover:bg-gold-800">Continue to checkout<ArrowRight size={18} /></Link><Link href="/books" className="mt-4 block text-center text-sm text-gold-700 underline underline-offset-4">Continue browsing</Link><DiscountForm /></aside></div>}</section></main>;
}
