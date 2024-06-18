import * as React from "react";

import { VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "relative flex w-full border-l border-transparent bg-transparent px-8 py-4 text-sm text-foreground ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-white focus-visible:outline-none disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "placeholder:text-muted-foreground focus-within:bg-secondary hover:bg-secondary",
        secondary:
          "text-navy-900 placeholder:text-slate-500 focus-within:bg-muted hover:bg-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
