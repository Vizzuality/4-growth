import { PropsWithChildren } from "react";

import { TopNavToggle } from "@/containers/nav-toggle";
import Overlay from "@/containers/overlay";
import Sidebar from "@/containers/sidebar";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Overlay />
      <div className="grid h-full grid-cols-[280px_1fr] gap-0.5">
        <div className="flex h-full flex-col gap-0.5 overflow-hidden">
          <Sidebar />
        </div>
        <div className="relative flex h-full flex-col gap-0.5 overflow-hidden">
          <TopNavToggle />
          {children}
        </div>
      </div>
    </>
  );
}
