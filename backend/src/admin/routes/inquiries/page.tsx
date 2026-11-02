import { defineRouteConfig } from "@medusajs/admin-sdk";
import { useCallback, useEffect, useState, type FormEvent } from "react";

type Status = "received" | "reviewing" | "needs-information" | "proposed" | "confirmed" | "declined" | "closed";
type Inquiry = {
  id: string; full_name: string; email: string; phone: string; organization: string | null;
  service: string; preferred_date: string | null; delivery_format: string; message: string;
  status: Status; notification_status: string; created_at: string; confirmed_date: string | null;
  status_history: unknown;
};
const statuses: Status[] = ["received", "reviewing", "needs-information", "proposed", "confirmed", "declined", "closed"];
const transitions: Record<Status, Status[]> = {
  received: ["reviewing", "declined", "closed"], reviewing: ["needs-information", "proposed", "declined", "closed"],
  "needs-information": ["reviewing", "closed"], proposed: ["confirmed", "reviewing", "declined", "closed"],
  confirmed: ["reviewing", "closed"], declined: ["reviewing", "closed"], closed: [],
};
const field = "w-full rounded-md border border-ui-border-base bg-ui-bg-field px-3 py-2 text-ui-fg-base";

async function request(path: string, init?: RequestInit) {
  const response = await fetch(path, { credentials: "include", ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "The request could not be completed.");
  return data;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState("");
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [nextStatus, setNextStatus] = useState<Status | "">("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = await request(`/admin/inquiries?limit=25&offset=${offset}${filter ? `&status=${filter}` : ""}`);
      setInquiries(data.inquiries); setCount(data.count);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load inquiries."); }
    finally { setLoading(false); }
  }, [filter, offset]);
  useEffect(() => { void load(); }, [load]);

  async function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const data = new FormData(event.currentTarget);
    setSaving(true); setError(""); setNotice("");
    try {
      await request(`/admin/inquiries/${selected.id}`, { method: "POST", body: JSON.stringify({ status: nextStatus, note: data.get("note"), availability_verified: data.get("availability_verified") === "on", ...(nextStatus === "confirmed" ? { confirmed_date: data.get("confirmed_date"), calendar_reference: data.get("calendar_reference") } : {}) }) });
      setSelected(null); setNextStatus(""); setNotice("Inquiry status updated."); await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to update inquiry."); }
    finally { setSaving(false); }
  }

  return <main className="space-y-6 p-6 text-ui-fg-base">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-xl font-semibold">Coaching inquiries</h1><p className="mt-2 text-sm text-ui-fg-subtle">Review requests, track follow-up, and verify availability before confirming a date.</p></div><button className="rounded-md border border-ui-border-base bg-ui-bg-base px-4 py-2 text-sm" onClick={() => void load()}>Refresh</button></header>
    <div className="rounded-lg border border-ui-border-base bg-ui-bg-base p-5"><label className="text-sm font-medium">Status filter<select className={`${field} mt-2 max-w-xs`} value={filter} onChange={event => { setFilter(event.target.value); setOffset(0); }}><option value="">All requests</option>{statuses.map(status => <option key={status} value={status}>{status}</option>)}</select></label></div>
    {error && <p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-900">{error}</p>}
    {notice && <p role="status" className="rounded-lg border border-green-300 bg-green-50 p-4 text-sm text-green-900">{notice}</p>}
    {loading ? <p role="status">Loading inquiries…</p> : <div className="overflow-x-auto rounded-lg border border-ui-border-base bg-ui-bg-base"><table className="w-full text-left text-sm"><thead className="border-b border-ui-border-base text-ui-fg-subtle"><tr>{["Received", "Name", "Service", "Preferred date", "Status", "Email notification", "Review"].map(title => <th className="px-4 py-3 font-medium" key={title}>{title}</th>)}</tr></thead><tbody>{inquiries.map(inquiry => <tr key={inquiry.id} className="border-b border-ui-border-base"><td className="whitespace-nowrap px-4 py-4">{new Date(inquiry.created_at).toLocaleDateString()}</td><td className="px-4 py-4 font-medium">{inquiry.full_name}</td><td className="px-4 py-4">{inquiry.service}</td><td className="px-4 py-4">{inquiry.preferred_date || "Not specified"}</td><td className="px-4 py-4">{inquiry.status}</td><td className="px-4 py-4">{inquiry.notification_status}</td><td className="px-4 py-4"><button className="rounded-md border border-ui-border-base px-3 py-2" onClick={() => { setSelected(inquiry); setNextStatus(transitions[inquiry.status][0] || ""); setNotice(""); }}>Open</button></td></tr>)}</tbody></table>{!inquiries.length && <p className="p-8 text-center text-ui-fg-subtle">No inquiries match this filter.</p>}</div>}
    <div className="flex items-center justify-between gap-4 text-sm"><p>{count} request{count === 1 ? "" : "s"}</p><div className="flex gap-3"><button className="rounded-md border border-ui-border-base px-3 py-2 disabled:opacity-40" disabled={offset === 0 || loading} onClick={() => setOffset(Math.max(0, offset - 25))}>Previous</button><button className="rounded-md border border-ui-border-base px-3 py-2 disabled:opacity-40" disabled={offset + 25 >= count || loading} onClick={() => setOffset(offset + 25)}>Next</button></div></div>
    {selected && <section aria-labelledby="inquiry-review-title" className="rounded-lg border border-ui-border-base bg-ui-bg-base p-6">
      <div className="flex items-start justify-between gap-4"><div><h2 id="inquiry-review-title" className="text-lg font-semibold">{selected.full_name}</h2><p className="mt-2 font-mono text-xs text-ui-fg-subtle">{selected.id}</p></div><button className="rounded-md border border-ui-border-base px-3 py-2 text-sm" onClick={() => setSelected(null)}>Close</button></div>
      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2"><div><dt className="font-medium">Email</dt><dd className="mt-1">{selected.email}</dd></div><div><dt className="font-medium">Phone</dt><dd className="mt-1">{selected.phone}</dd></div><div><dt className="font-medium">Organization</dt><dd className="mt-1">{selected.organization || "Not specified"}</dd></div><div><dt className="font-medium">Delivery format</dt><dd className="mt-1">{selected.delivery_format}</dd></div><div><dt className="font-medium">Preferred date (Kenya)</dt><dd className="mt-1">{selected.preferred_date || "Not specified"}</dd></div><div><dt className="font-medium">Confirmed date (Kenya)</dt><dd className="mt-1">{selected.confirmed_date || "Not confirmed"}</dd></div></dl>
      <div className="mt-5 whitespace-pre-wrap rounded-md bg-ui-bg-subtle p-4 text-sm">{selected.message}</div>
      <details className="mt-5 rounded-md border border-ui-border-base p-4"><summary className="cursor-pointer text-sm font-medium">Review history</summary><ol className="mt-4 space-y-3 text-sm">{(() => {
        const history = selected.status_history as { entries?: { status: string; at: string; actor: string; note?: string; confirmed_date?: string }[] };
        return (Array.isArray(history?.entries) ? history.entries : []).map((entry, index) => <li key={`${entry.at}-${index}`} className="border-l-2 border-ui-border-base pl-4"><p className="font-medium">{entry.status}</p><p className="mt-1 text-xs text-ui-fg-subtle">{new Date(entry.at).toLocaleString()} · {entry.actor}</p>{entry.note && <p className="mt-2 whitespace-pre-wrap">{entry.note}</p>}{entry.confirmed_date && <p className="mt-1">Confirmed date: {entry.confirmed_date}</p>}</li>);
      })()}</ol></details>
      {transitions[selected.status].length > 0 ? <form className="mt-6 space-y-4 border-t border-ui-border-base pt-6" onSubmit={review}>
        <label className="block text-sm font-medium">New status<select className={`${field} mt-2`} value={nextStatus} onChange={event => setNextStatus(event.target.value as Status)} required>{transitions[selected.status].map(status => <option key={status} value={status}>{status}</option>)}</select></label>
        <label className="block text-sm font-medium">Private review note<textarea className={`${field} mt-2 min-h-24`} name="note" required minLength={3} maxLength={1000} /></label>
        {nextStatus === "confirmed" && <fieldset className="space-y-4 rounded-md border border-amber-300 p-4"><legend className="px-2 text-sm font-semibold">Calendar verification required</legend><p className="text-sm text-ui-fg-subtle">Check the actual calendar before confirming. This screen does not query calendar availability automatically.</p><label className="block text-sm font-medium">Confirmed date (Kenya time)<input className={`${field} mt-2`} type="date" name="confirmed_date" required /></label><label className="block text-sm font-medium">Calendar reference or verification details<input className={`${field} mt-2`} name="calendar_reference" required maxLength={500} /></label><label className="flex items-start gap-2 text-sm"><input className="mt-0.5" name="availability_verified" type="checkbox" required /><span>I have checked the calendar and verified availability for this date.</span></label></fieldset>}
        <button className="rounded-md bg-ui-button-inverted px-4 py-2 text-sm font-medium text-ui-fg-on-inverted disabled:opacity-40" disabled={saving} type="submit">{saving ? "Saving…" : "Save review"}</button>
      </form> : <p className="mt-6 text-sm text-ui-fg-subtle">This request is closed.</p>}
      {selected.notification_status !== "sent" && <button className="mt-5 rounded-md border border-ui-border-base px-4 py-2 text-sm" type="button" disabled={saving} onClick={async () => { setSaving(true); setError(""); try { const data = await request(`/admin/inquiries/${selected.id}/retry-notification`, { method: "POST", body: "{}" }); setNotice(`Notification status: ${data.status}`); await load(); } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to retry email."); } finally { setSaving(false); } }}>Retry notification</button>}
    </section>}
  </main>;
}

export const config = defineRouteConfig({ label: "Coaching inquiries" });
