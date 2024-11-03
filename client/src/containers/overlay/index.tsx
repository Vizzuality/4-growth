"use client";
import { FC } from "react";

import { useAtomValue } from "jotai";

import { showOverlayAtom } from "@/containers/overlay/store";

import { Overlay as OverlayComponent } from "@/components/ui/overlay";

const Overlay: FC = () => {
  const showOverlay = useAtomValue(showOverlayAtom);

  if (showOverlay) return <OverlayComponent />;

  return null;
};

export default Overlay;
