import { useState } from "react";

import { useSetAtom } from "jotai";

import { showOverlayAtom } from "@/containers/overlay/store";
import ProjectionsSettingsSelector from "@/containers/projections-settings-selector";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SIDEBAR_POPOVER_CLASS } from "@/constants";

interface ProjectionsSettingsOption<T> {
  label: string;
  value: T;
}
interface ProjectionsSettingsPopupProps<T> {
  name: string;
  selected: ProjectionsSettingsOption<T> | null;
  options: ProjectionsSettingsOption<T>[];
  onItemClick: (value: T) => void;
}

const ProjectionsSettingsPopup = <T,>({
  name,
  selected,
  options,
  onItemClick,
}: ProjectionsSettingsPopupProps<T>) => {
  const [showPopup, setShowPopup] = useState(false);
  const setShowOverlay = useSetAtom(showOverlayAtom);
  const handleFiltersPopupChange = (open: boolean) => {
    setShowPopup(open);
    setShowOverlay(open);
  };

  return (
    <Popover onOpenChange={handleFiltersPopupChange} open={showPopup}>
      <PopoverTrigger asChild>
        <Button
          variant="clean"
          className="inline-block h-full w-full whitespace-pre-wrap rounded-none px-4 py-3.5 text-left font-normal transition-colors hover:bg-secondary"
        >
          <span className="inline-block">
            {name}
            {selected?.label && (
              <>
                <span> is</span>
                <span className="font-bold"> {selected?.label}</span>
              </>
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="bottom"
        className={SIDEBAR_POPOVER_CLASS}
      >
        <ProjectionsSettingsSelector
          options={options}
          onItemClick={(v) => {
            onItemClick(v);
            handleFiltersPopupChange(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default ProjectionsSettingsPopup;
