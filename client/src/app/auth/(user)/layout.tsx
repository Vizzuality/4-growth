import { PropsWithChildren } from "react";

import type { Metadata } from "next";

import Header from "@/containers/header";

export const metadata: Metadata = {
  title: "4Growth",
  description: "Coming soon",
};

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="h-full space-x-0.5 space-y-0.5 overflow-y-auto md:grid md:grid-cols-12 md:space-y-0 xl:col-span-8">
      <div className="flex flex-col space-y-0.5 md:col-span-6 md:h-full">
        <Header />
        <div className="hidden h-full rounded-2xl bg-[url('/images/fields.avif')] bg-cover bg-center bg-no-repeat md:block" />
      </div>
      <div className="xl:col-pan-4 rounded-2xl bg-primary py-20 md:col-span-6">
        {children}
      </div>
    </div>
  );
}
