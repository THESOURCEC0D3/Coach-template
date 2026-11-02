import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-700 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gold-700 text-white hover:bg-gold-800",
        outline: "border border-gray-300 bg-white text-gray-700 hover:border-gold-700 hover:text-gold-700",
        secondary: "bg-gold-100 text-gold-800 hover:bg-gold-200",
        ghost: "text-gold-700 hover:bg-gold-50",
      },
      size: { default: "", sm: "min-h-10 px-4 py-2", lg: "min-h-13 px-7 py-3.5 text-base" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button ref={ref} type={type} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  ),
);
Button.displayName = "Button";
