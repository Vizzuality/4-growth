"use client";

import * as React from "react";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const radioGroupItemVariants = cva(
  "peer aspect-square h-4 w-4 shrink-0 rounded-full border disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "focus-visible:ring-ring border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50",
        secondary:
          "border-bluish-gray-500 enabled:hover:border-primary focus-visible:outline-none focus-visible:ring focus-visible:ring-offset-1 focus-visible:ring-offset-white data-[state=checked]:border-primary data-[state=checked]:bg-navy-700 data-[state=checked]:text-white focus-visible:ring-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> &
    VariantProps<typeof radioGroupItemVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(radioGroupItemVariants({ variant, className }))}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center text-current">
        {variant === "secondary" ? (
          <Check className="h-4 w-4" strokeWidth={3} />
        ) : (
          <Circle className="h-2.5 w-2.5 fill-current text-current" />
        )}
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
