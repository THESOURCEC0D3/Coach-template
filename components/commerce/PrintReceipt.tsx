"use client";
import { Printer } from "lucide-react";
export default function PrintReceipt() {
  return <button onClick={() => window.print()} type="button" className="mt-6 inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm font-semibold print:hidden"><Printer size={17} aria-hidden="true" />Print payment receipt</button>;
}
