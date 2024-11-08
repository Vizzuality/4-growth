"use client";
import { FC } from "react";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import Header from "@/containers/header";
import ExploreSidebar from "@/containers/sidebar/explore-sidebar";
import SandboxSidebar from "@/containers/sidebar/sandbox-sidebar";
import UserSandboxSidebar from "@/containers/sidebar/user-sandbox-sidebar";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const Sidebar: FC = () => {
  const isExplore = usePathname().startsWith("/explore");
  const params = useParams();
  let Component = isExplore ? ExploreSidebar : SandboxSidebar;

  if (params.id) {
    Component = UserSandboxSidebar;
  }

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
        <Component />
      </ScrollArea>
    </>
  );
};

export default Sidebar;
