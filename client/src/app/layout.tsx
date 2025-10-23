import { Inter } from "next/font/google";
import { headers } from "next/headers";

import Bowser from "bowser";
import type { Metadata } from "next";
import "@/app/globals.css";
import { getServerSession } from "next-auth";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { cn } from "@/lib/utils";

import { config } from "@/app/auth/api/[...nextauth]/config";

import Analytics from "@/containers/analytics";
import CookieDialog from "@/containers/cookie-dialog";

import { Toaster } from "@/components/ui/toaster";

import LayoutProviders from "./providers";

export const isMobileDevice = (): boolean => {
  const ua = headers().get("user-agent") || "unknown";

  return Bowser.getParser(ua).getPlatformType() === "mobile";
};

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
  const isMobile = isMobileDevice();

  return (
    <LayoutProviders session={session}>
      <html lang="en">
        <NuqsAdapter>
          <body className={cn(inter.className, "overflow-hidden")}>
            <Toaster />
            <CookieDialog />
            <Analytics />
            <main className={cn({ "h-lvh": !isMobile, "h-dvh": isMobile })}>
              {children}
            </main>
          </body>
        </NuqsAdapter>
      </html>
    </LayoutProviders>
  );
}
