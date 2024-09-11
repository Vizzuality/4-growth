import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl cursor-pointer text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:text-slate-400 disabled:bg-slate-300",
  {
    variants: {
      variant: {
        default:
          "bg-secondary text-foreground hover:bg-navy-800 disabled:bg-secondary/20",
        secondary:
          "bg-white text-secondary-foreground hover:bg-slate-200 disabled:bg-foreground/20",
        destructive:
          "bg-transparent border border-destructive text-foreground hover:border-red-600 text-destructive hover:text-red-600",
        outline:
          "border border-bluish-gray-500/35 bg-transparent hover:border-bluish-gray-500 disabled:border-bluish-gray-500/35 disabled:text-foreground/20 disabled:bg-transparent",
        "outline-alt":
          "border border-bluish-gray-500/35 text-primary bg-transparent hover:border-bluish-gray-500 disabled:border-bluish-gray-500/35 disabled:text-primary/20 disabled:bg-transparent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-foreground underline-offset-[3px] underline",
        clean: "",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        // ? is this a good name...?
        none: "p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
