import { FC, PropsWithChildren, ReactNode } from "react";

import ExternalLinks from "@/containers/external-links";

type BottomBarProps = PropsWithChildren<{
  legend?: ReactNode;
  /**
   * Puts the external links beside the triggers instead of on their own row.
   * Projections has too many triggers to share a row with them.
   */
  inlineExternalLinks?: boolean;
}>;

const BottomBar: FC<BottomBarProps> = ({
  children,
  legend,
  inlineExternalLinks,
}) => {
  return (
    <div className="sticky flex w-full flex-col gap-0.5 md:hidden">
      {legend}
      <div className="flex w-full gap-0.5">
        {children}
        {inlineExternalLinks && <ExternalLinks variant="bottom-bar" />}
      </div>
      {!inlineExternalLinks && (
        <div className="flex w-full gap-0.5">
          <ExternalLinks variant="bottom-bar" />
        </div>
      )}
    </div>
  );
};

export default BottomBar;
