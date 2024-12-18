import { FC } from "react";

import { cn } from "@/lib/utils";

import NoDataIcon from "@/components/icons/no-data";

interface NoDataProps {
  className?: HTMLDivElement["className"] | undefined;
  /**
   * Overrides default icon
   */
  icon?: React.ReactNode;
  /**
   * Overrides default description
   */
  description?: string;
}

const NoData: FC<NoDataProps> = ({ className, icon, description }) => {
  return (
    <div
      className={cn(
        "flex h-full flex-col items-center justify-center gap-4 rounded-2xl bg-disabled-background/5 p-8 text-xs text-disabled-foreground",
        className,
      )}
    >
      {icon || <NoDataIcon />}
      <p>{description || "No data available for this item."}</p>
    </div>
  );
};

export default NoData;
