import { FC } from "react";

import Link from "next/link";

import { WIDGET_VISUALIZATIONS } from "@shared/dto/widgets/widget-visualizations.constants";
import { ArrowRight } from "lucide-react";

import Title from "@/components/ui/title";

interface NavigationProps {
  indicator: string;
  href: string;
  visualization:
    | (typeof WIDGET_VISUALIZATIONS)["FILTER"]
    | (typeof WIDGET_VISUALIZATIONS)["NAVIGATION"];
}

const Navigation: FC<NavigationProps> = ({
  indicator,
  href,
  visualization,
}) => {
  if (visualization === WIDGET_VISUALIZATIONS.FILTER) {
    return (
      <Link
        href={href}
        className="group flex flex-1 flex-col justify-between p-6"
      >
        <div className="flex items-center justify-end">
          <div className="relative mr-2 translate-x-full translate-y-[-25%] transform text-sm font-semibold opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
            Apply filters
          </div>
          <div className="rounded-full bg-white p-2 text-accent">
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </div>
        </div>

        <Title as="h3">{indicator}</Title>
      </Link>
    );
  }

  if (visualization === WIDGET_VISUALIZATIONS.NAVIGATION) {
    return (
      <Link
        href={href}
        className="group relative flex flex-1 flex-col justify-between overflow-hidden p-6"
      >
        <div className="absolute inset-0 bg-[url('/images/explore/sandbox-navigation-widget.avif')] bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-in-out group-hover:scale-110"></div>
        <div className="z-10 flex items-center justify-end">
          <div className="relative mr-2 translate-x-full transform text-sm font-semibold opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
            Explore in Sandbox
          </div>
          <div className="rounded-full bg-white p-2 text-navy-950">
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </div>
        </div>

        <Title className="z-10" as="h3">
          {indicator}
        </Title>
      </Link>
    );
  }

  console.warn(
    `Navigation widget: Unsupported visualization type "${visualization}" for indicator "${indicator}".`,
  );
  return null;
};

export default Navigation;
