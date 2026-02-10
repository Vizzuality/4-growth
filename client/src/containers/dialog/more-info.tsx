import { useMemo } from "react";

import DOMPurify from "dompurify";
import { useAtom } from "jotai";

import { infoAtom } from "@/containers/dialog/store";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const MoreInfoDialog = () => {
  const [info, setInfo] = useAtom(infoAtom);
  const description = useMemo(() => {
    return DOMPurify.sanitize(info?.description ?? "");
  }, [info?.description]);

  return (
    <Dialog open={!!info} onOpenChange={(open) => setInfo(open ? info : null)}>
      <DialogContent className="bg-white text-navy-950">
        <DialogHeader>
          <DialogTitle>{info?.title}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-[#627188]">
          <div
            className="prose text-xs"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </DialogDescription>
        <DialogFooter className="sm:justify-start">
          <Button onClick={() => setInfo(null)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoreInfoDialog;
