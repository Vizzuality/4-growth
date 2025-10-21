"use client";
import { PropsWithChildren } from "react";

import { Provider as JotaiProvider } from "jotai";

import { TopNavToggle } from "@/containers/nav-toggle";
import Overlay from "@/containers/overlay";
import Sidebar from "@/containers/sidebar";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <JotaiProvider>
      <Overlay />
      <div className="grid h-full grid-cols-1 md:grid-cols-[280px_1fr] md:gap-0.5">
        <div className="hidden h-full flex-col gap-0.5 overflow-hidden md:flex">
          <Sidebar />
        </div>
        <div className="relative flex h-full flex-col gap-0.5 overflow-hidden">
          <TopNavToggle />
          {children}
        </div>
      </div>
    </JotaiProvider>
  );
}
