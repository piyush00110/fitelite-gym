import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm",
        secondary:
          "border-transparent bg-secondary/80 text-secondary-foreground backdrop-blur-sm",
        destructive:
          "border-transparent bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-sm",
        outline: "text-foreground border-border/60",
        success:
          "border-transparent bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-sm",
        warning:
          "border-transparent bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };