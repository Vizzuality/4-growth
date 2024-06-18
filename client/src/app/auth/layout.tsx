import { PropsWithChildren } from "react";

import type { Metadata } from "next";

import Header from "@/containers/header";

export const metadata: Metadata = {
  title: "4Growth",
  description: "Coming soon",
};

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="grid h-full grid-cols-12 space-x-0.5">
      <div className="col-span-8 flex h-full flex-col space-y-0.5">
        <Header />
        <div className="h-full rounded-2xl bg-[url('/images/fields.avif')] bg-cover bg-center bg-no-repeat" />
      </div>
      <div className="col-span-4 rounded-2xl bg-primary py-20">{children}</div>
    </div>
  );
}
