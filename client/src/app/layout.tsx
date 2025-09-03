import { Inter } from "next/font/google";

import type { Metadata } from "next";
import "@/app/globals.css";
import { getServerSession } from "next-auth";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { cn } from "@/lib/utils";

import { config } from "@/app/auth/api/[...nextauth]/config";

import { Toaster } from "@/components/ui/toaster";

import LayoutProviders from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "4Growth",
  description: "Coming soon",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(config);

  return (
    <LayoutProviders session={session}>
      <html lang="en">
        <NuqsAdapter>
          <body className={cn(inter.className, "overflow-hidden")}>
            <Toaster />
            <main className="h-lvh">{children}</main>
          </body>
        </NuqsAdapter>
      </html>
    </LayoutProviders>
  );
}
