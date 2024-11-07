"use client";
import { FC } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import Header from "@/containers/header";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ExploreSidebar from "@/containers/sidebar/explore-sidebar";
import SandboxSidebar from "@/containers/sidebar/sandbox-sidebar";

const Sidebar: FC = () => {
  const isExplore = usePathname().startsWith("/explore");

  return (
    <>
      <Header />
      <div className="flex rounded-2xl bg-primary">
        <Button
          variant="clean"
          className={cn("w-full", isExplore && "bg-white text-primary")}
          asChild
        >
          <Link href="/explore">Explore</Link>
        </Button>
        <Button
          variant="clean"
          className={cn("w-full", !isExplore && "bg-white text-primary")}
          asChild
        >
          <Link href="/sandbox">Sandbox</Link>
        </Button>
      </div>
      <ScrollArea>
        {isExplore ? <ExploreSidebar /> : <SandboxSidebar />}
      </ScrollArea>
    </>
  );
};

export default Sidebar;
