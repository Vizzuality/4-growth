import { FC, PropsWithChildren } from "react";

import ExternalLinks from "@/containers/external-links";

const BottomBar: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="sticky flex w-full flex-col gap-0.5 md:hidden">
      <div className="flex w-full gap-0.5">{children}</div>
      <ExternalLinks variant="bottom-bar" />
    </div>
  );
};

export default BottomBar;
