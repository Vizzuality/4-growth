import { FC, PropsWithChildren } from "react";

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

const NoData: FC<PropsWithChildren<NoDataProps>> = ({
  className,
  icon,
  description,
  children,
}) => {
  return (
    <div
      className={cn(
        "flex h-full flex-col items-center justify-center gap-4 rounded-2xl p-8 text-xs text-disabled-foreground",
        className,
      )}
    >
      {icon || <NoDataIcon />}
      {children ? (
        children
      ) : (
        <p>{description || "No data available for this item."}</p>
      )}
    </div>
  );
};

export default NoData;
