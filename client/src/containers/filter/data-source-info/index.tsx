import { FC, Fragment, useState } from "react";

import { HelpCircle } from "lucide-react";

import { cn } from "@/lib/utils";

import { DATA_SOURCE_INFO_SECTIONS } from "@/containers/filter/data-source-info/constants";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DataSourceInfoButtonProps {
  className?: string;
}

const DataSourceInfoButton: FC<DataSourceInfoButtonProps> = ({ className }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "rounded-full transition-opacity hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
            className,
          )}
        >
          <HelpCircle className="h-4 w-4" aria-hidden />
          <span className="sr-only">About the data sources</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] grid-rows-[auto_minmax(0,1fr)_auto] bg-white text-navy-950">
        <DialogHeader>
          <DialogTitle className="text-xl leading-12">Data sources</DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <div className="space-y-2 overflow-y-auto text-xs text-[#627188]">
            {DATA_SOURCE_INFO_SECTIONS.map(({ heading, body }) => (
              <Fragment key={heading ?? "intro"}>
                {heading && <p className="font-bold text-navy-950">{heading}</p>}
                <p className="text-[#627188]">{body}</p>
              </Fragment>
            ))}
          </div>
        </DialogDescription>
        <DialogFooter className="sm:justify-start">
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DataSourceInfoButton;
