import { FC, PropsWithChildren } from "react";

const BottomBar: FC<PropsWithChildren> = ({ children }) => {
  return <div className="bottom-0 left-0 flex md:hidden">{children}</div>;
};

export default BottomBar;
