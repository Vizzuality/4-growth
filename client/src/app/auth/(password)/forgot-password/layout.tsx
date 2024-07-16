import { PropsWithChildren } from "react";

import type { Metadata } from "next";

import Header from "@/containers/header";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Forgot password | 4Growth",
};

export default function ForgotPasswordLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col gap-0.5">
        <Header />
        {children}
      </div>
    </div>
  );
}
