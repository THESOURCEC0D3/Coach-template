import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ArrowDownTray } from "@medusajs/icons";
import { Container, Heading, Text, Button, Table } from "@medusajs/ui";
import { useEffect, useState } from "react";

type Row = { id: string; order_id: string; title: string; format: string; grant_count: number; download_limit: number; revoked_at: string | null };
export default function DownloadEntitlements() {
  const [rows, setRows] = useState<Row[]>([]), [error, setError] = useState(""), [busy, setBusy] = useState("");
  const load = async () => { const response = await fetch("/admin/download-entitlements", { credentials: "include" }); if (!response.ok) throw new Error("Could not load download rights."); const data = await response.json(); setRows(data.entitlements); };
  useEffect(() => { load().catch((err) => setError(err.message)); }, []);
  const revoke = async (id: string) => { setBusy(id); setError(""); try { const response = await fetch(`/admin/download-entitlements/${id}`, { method: "DELETE", credentials: "include" }); if (!response.ok) throw new Error("Could not revoke access."); await load(); } catch (err) { setError(err instanceof Error ? err.message : "Please try again."); } finally { setBusy(""); } };
  return <Container><Heading level="h1">Digital download rights</Heading><Text className="mt-2 text-ui-fg-subtle">Created only for paid digital lines. Revocation stops new links; previously issued links expire within five minutes.</Text>{error && <Text className="mt-4 text-ui-fg-error">{error}</Text>}<Table className="mt-6"><Table.Header><Table.Row><Table.HeaderCell>Book</Table.HeaderCell><Table.HeaderCell>Order</Table.HeaderCell><Table.HeaderCell>Links used</Table.HeaderCell><Table.HeaderCell>Access</Table.HeaderCell></Table.Row></Table.Header><Table.Body>{rows.map((row) => <Table.Row key={row.id}><Table.Cell>{row.title} ({row.format})</Table.Cell><Table.Cell>{row.order_id}</Table.Cell><Table.Cell>{row.grant_count} / {row.download_limit}</Table.Cell><Table.Cell>{row.revoked_at ? "Revoked" : <Button variant="secondary" size="small" disabled={Boolean(busy)} onClick={() => revoke(row.id)}>{busy === row.id ? "Revoking…" : "Revoke"}</Button>}</Table.Cell></Table.Row>)}</Table.Body></Table>{!rows.length && <Text className="mt-5 text-ui-fg-subtle">No digital entitlements exist yet.</Text>}</Container>;
}
export const config = defineRouteConfig({ label: "Digital downloads", icon: ArrowDownTray });
