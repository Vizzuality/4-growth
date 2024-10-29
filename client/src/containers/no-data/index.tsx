import { FC } from "react";

import { cn } from "@/lib/utils";

import NoDataIcon from "@/components/icons/no-data";

interface NoDataProps {
  className?: HTMLDivElement["className"] | undefined;
}

const NoData: FC<NoDataProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "flex h-full flex-col items-center justify-center gap-4 rounded-2xl bg-disabled-background/5 p-8 text-xs text-disabled-foreground",
        className,
      )}
    >
      <NoDataIcon />
      <p>No data available for this item.</p>
    </div>
  );
};

export default NoData;
