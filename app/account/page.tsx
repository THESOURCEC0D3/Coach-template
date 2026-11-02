import Link from "next/link";
import { BookOpen, Package, LogOut } from "lucide-react";
import PageIntro from "@/components/site/PageIntro";
import EmptyState from "@/components/site/EmptyState";
import { CustomerForms, DownloadForm } from "@/components/commerce/Forms";
import { getCustomer, getOrders, getDownloads } from "@/lib/commerce/cart";
import { commerceConfig } from "@/lib/commerce/client";
import { signOut } from "@/lib/commerce/actions";
import { money } from "@/lib/commerce/helpers";

export const metadata = { title: "Your Account", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const customer = await getCustomer().catch(() => null);
  const orders = customer ? await getOrders().catch(() => []) : [];
  const downloads = customer ? await getDownloads().catch(() => []) : [];
  return <main><PageIntro label="Your account" title={customer ? `Welcome${customer.first_name ? `, ${customer.first_name}` : ""}.` : "Your own reading corner."} description={customer ? "Your purchases, order updates and digital library, together in one place." : "Sign in to keep track of your orders and access the digital editions you have purchased."} /><section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">{!commerceConfig().available ? <EmptyState title="Accounts will open with the bookstore" description="For book availability and publication enquiries, get in touch with Trophy." href="/contact" action="Contact Trophy" /> : !customer ? <CustomerForms /> : <><div className="mb-10 flex flex-wrap items-center justify-between gap-4"><p className="text-gray-500">{customer.email}</p><form action={signOut}><button className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold"><LogOut size={16} />Sign out</button></form></div><div className="grid gap-10 lg:grid-cols-2"><section className="rounded-3xl border border-gray-100 p-7"><div className="flex items-center gap-3"><Package className="text-gold-700" /><h2 className="text-2xl">Your orders</h2></div>{orders.length ? <ul className="mt-6 divide-y divide-gray-100">{orders.map((order) => <li key={order.id}><Link href={`/orders/${order.id}`} className="block py-5"><div className="flex justify-between gap-4"><span className="font-semibold text-gold-700">Order #{order.display_id}</span><span>{money(order.total, order.currency_code)}</span></div><p className="mt-2 text-sm capitalize text-gray-500">{order.payment_status?.replaceAll("_", " ")} · {order.fulfillment_status?.replaceAll("_", " ")}</p></Link></li>)}</ul> : <p className="mt-6 text-gray-500">Your orders will appear here after your first purchase.</p>}</section><section className="rounded-3xl border border-gray-100 p-7"><div className="flex items-center gap-3"><BookOpen className="text-gold-700" /><h2 className="text-2xl">Your digital library</h2></div>{downloads.length ? <ul className="mt-6 space-y-6">{downloads.map((entry) => <li key={entry.id} className="rounded-2xl bg-gray-50 p-5"><h3 className="text-lg">{entry.title}</h3><p className="my-3 text-xs text-gray-500">{Math.max(0, entry.download_limit - entry.grant_count)} download links remaining</p><DownloadForm entitlement={entry} /></li>)}</ul> : <p className="mt-6 leading-relaxed text-gray-500">Paid digital editions will appear here when your payment is confirmed. Nothing is released before successful payment.</p>}</section></div></>}</section></main>;
}
