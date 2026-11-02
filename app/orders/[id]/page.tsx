import Link from "next/link";
import { notFound } from "next/navigation";
import PageIntro from "@/components/site/PageIntro";
import { getOrder } from "@/lib/commerce/cart";
import { money } from "@/lib/commerce/helpers";
import PrintReceipt from "@/components/commerce/PrintReceipt";
import { DownloadForm } from "@/components/commerce/Forms";

export const metadata = { title: "Order Details", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Customer ownership or the signed guest capability is verified by the backend.
  const order = await getOrder(id);
  if (!order) notFound();
  return <main><PageIntro label="Your purchase" title={`Order #${order.display_id}`} description="Track your purchase and find your order details." /><section className="mx-auto max-w-3xl px-4 py-12"><div className="rounded-3xl border border-gray-100 p-7"><dl className="grid gap-5 text-sm sm:grid-cols-3"><div><dt className="text-gray-500">Payment</dt><dd className="mt-2 font-semibold capitalize">{order.payment_status?.replaceAll("_", " ")}</dd></div><div><dt className="text-gray-500">Fulfillment</dt><dd className="mt-2 font-semibold capitalize">{order.fulfillment_status?.replaceAll("_", " ")}</dd></div><div><dt className="text-gray-500">Total</dt><dd className="mt-2 font-semibold">{money(order.total, order.currency_code)}</dd></div></dl><ul className="mt-8 divide-y divide-gray-100 border-t border-gray-100">{order.items.map((item) => <li key={item.id} className="flex justify-between gap-5 py-5"><span>{item.title} × {item.quantity}</span><span>{money(item.total, order.currency_code)}</span></li>)}</ul>{order.downloads?.length ? <section className="mt-8 border-t border-gray-100 pt-6"><h2 className="mb-5 text-2xl">Your digital editions</h2><ul className="space-y-5">{order.downloads.map((download) => <li key={download.id}><h3 className="mb-3 text-lg">{download.title}</h3><DownloadForm entitlement={download} orderId={order.id} /></li>)}</ul></section> : null}{order.payment_status === "captured" && <PrintReceipt />}<Link href="/account" className="mt-6 inline-block font-semibold text-gold-700 underline underline-offset-4">Back to your account →</Link></div></section></main>;
}
