import { FC, useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

interface ScenarioInfoCardProps {
  title: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
  shortDescription: React.ReactNode;
  longDescription: React.ReactNode;
}

const ScenarioInfoCard: FC<ScenarioInfoCardProps> = ({
  title,
  icon,
  isSelected,
  shortDescription,
  longDescription,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      role="button"
      className={cn({
        "group cursor-pointer rounded-2xl border-2 border-transparent bg-muted p-6 transition-colors":
          true,
        "hover:border-magenta-500": !isSelected,
        "bg-secondary text-foreground": isSelected,
      })}
      open={isOpen}
      onOpenChange={setIsOpen}
      onClick={onSelect}
    >
      <div className="space-y-4">
        <div
          className={cn({
            "inline-block rounded-full bg-secondary p-2 text-foreground transition-colors":
              true,
            "bg-foreground text-secondary": isSelected,
            "group-hover:bg-magenta-500": !isSelected,
          })}
        >
          {icon}
        </div>
        <h2
          className={cn({
            "text-base font-semibold text-navy-950": true,
            "text-foreground": isSelected,
          })}
        >
          {title}
        </h2>
        {shortDescription}
        {!isOpen && (
          <div className="inline-flex" onClick={(e) => e.stopPropagation()}>
            <CollapsibleTrigger asChild>
              <Button
                variant="clean"
                size="none"
                className={cn({
                  "text-xs font-bold text-secondary underline": true,
                  "text-foreground": isSelected,
                })}
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
              className={cn({
                "mt-4 text-xs font-bold text-secondary underline": true,
                "text-foreground": isSelected,
              })}
            >
              Fewer details
            </Button>
          </CollapsibleTrigger>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ScenarioInfoCard;
