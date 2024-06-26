import { ReactNode } from "react";

import { cn } from "@/lib/utils";
//
const Wrapper = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn({
        "container mx-auto flex w-full flex-grow flex-col": true,
        [`${className}`]: className !== undefined,
      })}
    >
      {children}
    </div>
  );
};

export default Wrapper;
