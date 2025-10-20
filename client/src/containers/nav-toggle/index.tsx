"use client";

import Link from "next/link";

import useRouteConfig from "@/hooks/use-route-config";

import Header from "@/containers/header";

import { Toggle, ToggleButton } from "@/components/ui/toggle";
import { getRouteHref } from "@/utils/route-config";

export function SidebarNavToggle() {
  const { type } = useRouteConfig();

  return (
    <Toggle>
      <ToggleButton isSelected={type === "surveyAnalysis"}>
        <Link href={getRouteHref("surveyAnalysis", "explore")}>
          Survey analysis
        </Link>
      </ToggleButton>
      <ToggleButton isSelected={type === "projections"}>
        <Link href={getRouteHref("projections", "explore")}>Projections</Link>
      </ToggleButton>
    </Toggle>
  );
}

export function TopNavToggle() {
  const { type, view } = useRouteConfig();

  return (
    <>
      <div className="md:hidden">
        <Header />
      </div>
      <Toggle>
        <ToggleButton
          isSelected={view === "explore"}
          isSelectedClassName="bg-secondary"
        >
          <Link href={getRouteHref(type, "explore")}>Explore</Link>
        </ToggleButton>
        <ToggleButton
          isSelected={view === "sandbox"}
          isSelectedClassName="bg-secondary"
        >
          <Link href={getRouteHref(type, "sandbox")}>Sandbox</Link>
        </ToggleButton>
      </Toggle>
    </>
  );
}
