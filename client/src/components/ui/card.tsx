import { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

export function CardTitle({
  className,
  children,
}: PropsWithChildren<{
  className?: HTMLHeadingElement["className"] | undefined;
}>) {
  return (
    <h3 className={cn("text-base font-semibold text-foreground", className)}>
      {children}
    </h3>
  );
}

export function Card({
  className,
  children,
}: PropsWithChildren<{
  className?: HTMLDivElement["className"] | undefined;
}>) {
  return (
    <div
      className={cn(
        "flex grow break-inside-avoid flex-col overflow-hidden rounded-2xl bg-navy-800 p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
