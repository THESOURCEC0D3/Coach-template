"use client";

import { useActionState } from "react";
import { subscribe } from "@/app/actions/subscribe";

const initialState = { success: false, error: null };

export default function LeadMagnetForm() {
  const [state, formAction, isPending] = useActionState(subscribe, initialState);

  if (state?.success) {
    return (
      <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 flex items-center gap-3">
        <span className="text-2xl">📬</span>
        <p className="text-gray-700">
          Thanks! Check your inbox — the guide is on its way.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          name="firstName"
          placeholder="First name"
          required
          className="px-5 py-3.5 rounded-full border border-gray-300 focus:border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-200 transition"
        />
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          required
          className="px-5 py-3.5 rounded-full border border-gray-300 focus:border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-200 transition"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="bg-violet-700 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-violet-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Sending..." : "Get Instant Access"}
      </button>
      {state?.error && (
        <p className="text-sm text-red-600 mt-1">{state.error}</p>
      )}
    </form>
  );
}
