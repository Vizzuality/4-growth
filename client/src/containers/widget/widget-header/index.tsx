import { FC } from "react";

import { ClipboardCheckIcon } from "lucide-react";

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
          <p className="inline-flex items-center gap-1 text-2xs font-medium text-muted-foreground">
            <ClipboardCheckIcon className="h-4 w-4" strokeWidth={1.5} />
            <span>{responseRate}%</span>
          </p>
          {menu}
        </div>
      </div>
      {question && <p className="text-xs text-muted-foreground">{question}</p>}
    </header>
  );
};

export default WidgetHeader;
