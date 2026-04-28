"use client";

import { FC, useState } from "react";

import Link from "next/link";

import { EllipsisIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import SaveWidgetForm from "@/containers/widget/create-widget/form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

const btnClassName =
  "block w-full rounded-none px-4 py-3.5 text-left text-xs font-medium transition-colors hover:bg-muted";

interface SandboxMenuProps {
  downloadUrl: string;
  onSave: (name: string) => void;
  onUpdate?: () => void;
}

const SandboxMenu: FC<SandboxMenuProps> = ({
  downloadUrl,
  onSave,
  onUpdate,
}) => {
  const { data: session } = useSession();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const signInUrl = `/auth/signin?callbackUrl=${encodeURIComponent(
    typeof window !== "undefined"
      ? window.location.pathname + window.location.search
      : "/",
  )}`;

  const handleSaveClick = () => {
    setPopoverOpen(false);
    setDialogOpen(true);
  };

  const handleFormSubmit = (name: string) => {
    setDialogOpen(false);
    onSave(name);
  };

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            className="flex h-8 w-8 items-center rounded-full bg-navy-700 p-2 transition-colors hover:bg-navy-800"
            data-testid="sandbox-menu-button"
          >
            <EllipsisIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="p-0"
          onClick={() => setPopoverOpen(false)}
        >
          <div className="flex flex-col py-4">
            {session ? (
              <Button
                variant="clean"
                className={btnClassName}
                onClick={handleSaveClick}
              >
                Save visualization
              </Button>
            ) : (
              <Button variant="clean" className={btnClassName} asChild>
                <Link href={signInUrl}>Save visualization</Link>
              </Button>
            )}
            {onUpdate && (
              <Button
                variant="clean"
                className={btnClassName}
                onClick={onUpdate}
              >
                Update saved visualization
              </Button>
            )}
            <div className="px-4 py-2">
              <Separator />
            </div>
            <Button variant="clean" className={btnClassName} asChild>
              <a href={downloadUrl} download>
                Download as CSV
              </a>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-popover p-0 text-popover-foreground">
          <DialogDescription className="sr-only">
            Enter a name for your visualization
          </DialogDescription>
          <SaveWidgetForm onSubmit={handleFormSubmit} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SandboxMenu;
