import { FC } from "react";

import { cn } from "@/lib/utils";

import Title from "@/components/ui/title";

interface WidgetHeaderProps {
  indicator: string;
  question?: string;
  menu?: React.ReactNode;
  className?: string;
}

const WidgetHeader: FC<WidgetHeaderProps> = ({
  indicator,
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
        {menu}
      </div>
      {question && <p className="text-xs text-muted-foreground">{question}</p>}
    </header>
  );
};

export default WidgetHeader;
