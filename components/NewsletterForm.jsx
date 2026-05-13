"use client";

import { useActionState } from "react";
import { subscribe } from "@/app/actions/subscribe";

const initialState = { success: false, error: null };

export default function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(subscribe, initialState);

  if (state?.success) {
    return (
      <div className="bg-white rounded-2xl p-6 max-w-md mx-auto mt-8 flex flex-col items-center gap-2 shadow-md">
        <span className="text-3xl">🎉</span>
        <p className="text-gray-700 font-medium">
          You're in. First email lands Tuesday.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="max-w-md mx-auto mt-8">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          required
          className="flex-1 px-5 py-3.5 rounded-full border border-gray-300 focus:border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-200 transition bg-white"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-gray-900 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isPending ? "Joining..." : "Yes, I'm In →"}
        </button>
      </div>
      {state?.error && (
        <p className="text-sm text-red-900 mt-2 text-center">{state.error}</p>
      )}
    </form>
  );
}
