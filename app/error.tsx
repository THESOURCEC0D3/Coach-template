"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="mx-auto max-w-6xl px-5 py-24 text-center"><h1 className="text-4xl text-gray-900">Something interrupted your visit.</h1><p className="mx-auto mt-5 max-w-lg leading-relaxed text-gray-600">Please try again. If the problem continues, contact Trophy using the details below.</p><Button onClick={reset} className="mt-8">Try again</Button></main>;
}
