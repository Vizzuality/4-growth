import { PropsWithChildren } from "react";

import type { Metadata } from "next";

import Sidebar from "@/containers/sidebar";

export const metadata: Metadata = {
  title: "Explore | 4Growth",
  description: "Explore | 4Growth",
};

export default function ExploreLayout({ children }: PropsWithChildren) {
  return (
    <div className="grid h-full grid-cols-[280px_1fr] gap-0.5">
      <div className="flex h-full flex-col gap-0.5">
        <Sidebar />
      </div>
      <div className="flex h-full flex-col overflow-hidden">{children}</div>
    </div>
  );
}
