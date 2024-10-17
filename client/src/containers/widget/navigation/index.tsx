import { FC } from "react";

import Link from "next/link";

import { ArrowRight } from "lucide-react";

import Title from "@/components/ui/title";

const Navigation: FC<{
  indicator: string;
  href?: string;
}> = ({ indicator, href }) => {
  return (
    <Link
      href={href || "#"}
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
};

export default Navigation;
