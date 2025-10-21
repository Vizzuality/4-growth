import { FC, PropsWithChildren } from "react";

const BottomBar: FC<PropsWithChildren> = ({ children }) => {
  return <div className="sticky flex w-full md:hidden">{children}</div>;
};

export default BottomBar;
