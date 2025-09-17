import { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

export function Toggle({ children }: PropsWithChildren) {
  return (
    <div className="sticky left-0 top-0 flex rounded-2xl bg-primary">
      {children}
    </div>
  );
}

export function ToggleButton({
  isSelected,
  isSelectedClassName,
  children,
}: PropsWithChildren<{ isSelected: boolean; isSelectedClassName?: string }>) {
  return (
    <Button
      variant="clean"
      className={cn(
        "w-full",
        isSelected && (isSelectedClassName || "bg-white text-primary"),
      )}
      asChild
    >
      {children}
    </Button>
  );
}
