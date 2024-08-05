"use client";

import * as React from "react";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { VariantProps, cva } from "class-variance-authority";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const checkboxVariants = cva(
  "peer h-4 w-4 shrink-0 rounded-sm border focus-visible:outline-none focus-visible:ring focus-visible:ring-offset-1 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "border-bluish-gray-500 enabled:hover:border-white focus-visible:ring-offset-primary data-[state=checked]:bg-white data-[state=checked]:border-primary data-[state=checked]:text-primary focus-visible:ring-white",
        secondary:
          "border-bluish-gray-500 enabled:hover:border-primary focus-visible:ring-offset-white data-[state=checked]:bg-navy-700 data-[state=checked]:border-primary data-[state=checked]:text-white focus-visible:ring-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
    VariantProps<typeof checkboxVariants>
>(({ className, variant, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants({ variant, className }))}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
