"use client";
import { FC } from "react";

import { useParams } from "next/navigation";

import useRouteConfig from "@/hooks/use-route-config";

import Header from "@/containers/header";
import { SidebarNavToggle } from "@/containers/nav-toggle";
import ProjectionsExploreSidebar from "@/containers/sidebar/projections-sidebar/explore-sidebar";
import ProjectionsSandboxSidebar from "@/containers/sidebar/projections-sidebar/sandbox-sidebar";
import SurveyAnalysisExploreSidebar from "@/containers/sidebar/survey-analysis-sidebar/explore-sidebar";
import SurveyAnalysisSandboxSidebar from "@/containers/sidebar/survey-analysis-sidebar/sandbox-sidebar";
import SurveyAnalysisUserSandboxSidebar from "@/containers/sidebar/survey-analysis-sidebar/user-sandbox-sidebar";

import { ScrollArea } from "@/components/ui/scroll-area";

const Sidebar: FC = () => {
  const params = useParams();
  const { type, view, pathname } = useRouteConfig();
  let Component = null;

  switch (type) {
    case "projections":
      if (view === "explore") Component = ProjectionsExploreSidebar;

      if (view === "sandbox") Component = ProjectionsSandboxSidebar;
      break;
    case "surveyAnalysis":
      if (view === "sandbox")
        Component = params.id
          ? SurveyAnalysisUserSandboxSidebar
          : SurveyAnalysisSandboxSidebar;

      if (view === "explore") Component = SurveyAnalysisExploreSidebar;
      break;
    default:
      console.error(
        `Unable to assign sidebar component for pathname '${pathname}'`,
      );
  }

  return (
    <>
      <Header />
      <SidebarNavToggle />
      <ScrollArea>{Component && <Component />}</ScrollArea>
    </>
  );
};

export default Sidebar;
