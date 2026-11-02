import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input ref={ref} type={type} className={cn("flex min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base shadow-xs placeholder:text-gray-400 focus-visible:border-gold-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-700 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />
  ),
);
Input.displayName = "Input";
