import { FC } from "react";

import { cn } from "@/lib/utils";

import Title from "@/components/ui/title";

interface WidgetHeaderProps {
  indicator: string;
  responseRate?: number;
  question?: string;
  menu?: React.ReactNode;
  className?: string;
}

const WidgetHeader: FC<WidgetHeaderProps> = ({
  indicator,
  responseRate,
  question,
  menu,
  className,
}) => {
  return (
    <header className={cn("space-y-2 p-8", className)}>
      <div className="flex justify-between">
        <Title as="h3" className="text-base">
          {indicator}
        </Title>
        <div className="flex items-center gap-2">
          <p className="text-xs">{responseRate}%</p>
          {menu}
        </div>
      </div>
      {question && <p className="text-xs text-muted-foreground">{question}</p>}
    </header>
  );
};

export default WidgetHeader;
