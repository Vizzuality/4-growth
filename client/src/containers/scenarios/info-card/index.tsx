import { FC, useState } from "react";

import { cn } from "@/lib/utils";

import Check from "@/components/icons/check";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

interface ScenarioInfoCardProps {
  title: string;
  isSelected: boolean;
  onSelect: () => void;
  shortDescription: React.ReactNode;
  longDescription: React.ReactNode;
}

const ScenarioInfoCard: FC<ScenarioInfoCardProps> = ({
  title,
  isSelected,
  shortDescription,
  longDescription,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative mx-6">
      {isSelected && (
        <div className="absolute left-0 top-4 z-10 -translate-x-1/2 rounded-full bg-secondary p-2">
          <Check />
        </div>
      )}
      <Collapsible
        role="button"
        className={cn({
          "cursor-pointer rounded-2xl border-2 border-transparent bg-muted p-6 transition-colors hover:border-secondary":
            true,
          "border-secondary": isSelected,
        })}
        open={isOpen}
        onOpenChange={setIsOpen}
        onClick={onSelect}
      >
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-navy-950">{title}</h2>
          {shortDescription}
          {!isOpen && (
            <div className="inline-flex" onClick={(e) => e.stopPropagation()}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="clean"
                  size="none"
                  className="text-xs font-bold text-secondary underline"
                >
                  More details
                </Button>
              </CollapsibleTrigger>
            </div>
          )}
        </div>
        <CollapsibleContent>
          <Separator className="my-4 bg-muted-foreground" />
          {longDescription}
          <div className="inline-flex" onClick={(e) => e.stopPropagation()}>
            <CollapsibleTrigger asChild>
              <Button
                variant="clean"
                size="none"
                className="mt-4 text-xs font-bold text-secondary underline"
              >
                Fewer details
              </Button>
            </CollapsibleTrigger>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ScenarioInfoCard;
