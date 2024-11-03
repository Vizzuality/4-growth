"use client";
import { FC, PropsWithChildren } from "react";

import { useAtomValue } from "jotai";

import { showOverlayAtom } from "@/containers/overlay/store";

import { Overlay as OverlayComponent } from "@/components/ui/overlay";

const Overlay: FC<PropsWithChildren> = ({ children }) => {
  const showOverlay = useAtomValue(showOverlayAtom);

  return (
    <>
      {showOverlay && <OverlayComponent />}
      {children}
    </>
  );
};

export default Overlay;
