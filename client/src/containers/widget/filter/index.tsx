import { FC } from "react";

import Link from "next/link";

import { ArrowRight } from "lucide-react";

import Title from "@/components/ui/title";

const Filter: FC<{
  indicator: string;
  href: string;
}> = ({ indicator, href }) => {
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
};

export default Filter;
