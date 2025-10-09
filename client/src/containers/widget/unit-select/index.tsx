import { FC } from "react";

import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UnitSelect: FC<{
  id: string;
  value: string;
  items: string[];
  className?: string;
  onValueChange: (value: string) => void;
}> = ({ id, value, items, className, onValueChange }) => (
  <Select
    value={value}
    onValueChange={onValueChange}
    disabled={items.length <= 1}
  >
    <SelectTrigger
      className={cn(
        "min-w-fit flex-1 border-transparent bg-transparent disabled:cursor-default [&>span]:text-muted-foreground [&>svg]:opacity-100",
        className,
      )}
      disabled={items.length <= 1}
    >
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Unit</SelectLabel>
        {items.map((item) => (
          <SelectItem key={`select-${id}-${item}`} value={item}>
            {item}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);

export default UnitSelect;
