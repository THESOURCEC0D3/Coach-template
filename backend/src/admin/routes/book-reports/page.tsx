import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChartBar } from "@medusajs/icons";
import { Container, Heading, Text, Table } from "@medusajs/ui";
import { useEffect, useState } from "react";

type Report = { currency: string; orders_reviewed: number; paid_orders: number; captured: number; refunded: number; net_captured: number; book_units: { title: string; units: number }[]; scope: string };
export default function BookReports() {
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { const controller = new AbortController(); fetch("/admin/book-reports", { credentials: "include", signal: controller.signal }).then((response) => { if (!response.ok) throw new Error("Could not load sales report."); return response.json(); }).then(setReport).catch((err) => { if (err.name !== "AbortError") setError(err.message); }); return () => controller.abort(); }, []);
  const money = (amount: number) => new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(amount);
  return <Container><Heading level="h1">Bookstore sales</Heading>{error && <Text className="mt-4 text-ui-fg-error">{error}</Text>}{report ? <><Text className="mt-2 text-ui-fg-subtle">{report.scope}</Text><div className="my-6 grid gap-4 md:grid-cols-3">{[["Paid orders", report.paid_orders], ["Captured revenue", money(report.captured)], ["Net after refunds", money(report.net_captured)]].map(([title, value]) => <div key={title} className="rounded-lg border p-4"><Text className="text-ui-fg-subtle">{title}</Text><Heading level="h2" className="mt-2">{value}</Heading></div>)}</div><Heading level="h2" className="mb-3">Books in paid orders</Heading><Table><Table.Header><Table.Row><Table.HeaderCell>Title</Table.HeaderCell><Table.HeaderCell>Units</Table.HeaderCell></Table.Row></Table.Header><Table.Body>{report.book_units.map((book) => <Table.Row key={book.title}><Table.Cell>{book.title}</Table.Cell><Table.Cell>{book.units}</Table.Cell></Table.Row>)}</Table.Body></Table>{!report.book_units.length && <Text className="mt-5 text-ui-fg-subtle">Sales will appear after confirmed payments. No sample revenue is included.</Text>}</> : !error && <Text className="mt-5">Loading sales…</Text>}</Container>;
}
export const config = defineRouteConfig({ label: "Bookstore sales", icon: ChartBar });
