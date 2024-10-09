import { FC } from "react";

import Title from "@/components/ui/title";

const EmptyWidget: FC<{ indicator: string; question?: string }> = ({
  indicator,
  question,
}) => {
  return (
    <>
      <header className="space-y-2 p-6">
        <Title as="h3" className="text-base">
          {indicator}
        </Title>
        {question && (
          <p className="text-xs text-muted-foreground">{question}</p>
        )}
      </header>
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <p className="font-semibold">No data</p>
        <p className="text-xs">
          There was no data found for this visualization
        </p>
      </div>
    </>
  );
};

export default EmptyWidget;
