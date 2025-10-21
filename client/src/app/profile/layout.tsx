import { PropsWithChildren } from "react";

import type { Metadata } from "next";

import Header from "@/containers/header";

export const metadata: Metadata = {
  title: "4Growth",
  description: "Coming soon",
};

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="grid h-full grid-cols-1 gap-0.5 md:grid-cols-12 md:grid-rows-none">
      <div className="hidden h-full flex-col gap-0.5 md:col-span-4 md:flex xl:col-span-2">
        <Header />
        <div className="h-full rounded-2xl bg-[url('/images/profile.avif')] bg-cover bg-center bg-no-repeat" />
      </div>
      <Header className="md:hidden" />
      <div className="flex h-full flex-col overflow-hidden md:col-span-8 xl:col-span-10">
        {children}
      </div>
    </div>
  );
}
