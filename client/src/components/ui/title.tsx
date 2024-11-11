import { FC, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

const styles = {
  lg: "text-lg leading-10",
  xl: "text-xl leading-12",
  "2xl": "text-2xl leading-16",
};

const Title: FC<
  PropsWithChildren<{
    as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    size?: keyof typeof styles;
    className?: HTMLHeadingElement["className"];
  }>
> = ({ as, children, className, size = "lg" }) => {
  const HeadingElement = as;

  return (
    <HeadingElement className={cn("font-semibold", styles[size], className)}>
      {children}
    </HeadingElement>
  );
};

export default Title;
