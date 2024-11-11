import { ReactNode, useState } from "react";

import { EllipsisIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MenuButtonProps {
  className?: string;
  children?: ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export default function MenuButton({
  className,
  children,
  onOpenChange,
}: MenuButtonProps) {
  const [open, setOpen] = useState(false);
  const handleOnOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  };

  return (
    <Popover onOpenChange={handleOnOpenChange} open={open}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          className="flex h-8 w-8 items-center rounded-full bg-navy-700 p-2 transition-colors hover:bg-navy-800"
        >
          <EllipsisIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onClick={() => {
          setOpen(false);

          if (onOpenChange) {
            onOpenChange(false);
          }
        }}
        align="end"
        className={className}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}
