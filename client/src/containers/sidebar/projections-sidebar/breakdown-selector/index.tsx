import { FC, useMemo, useState } from "react";

import { useSetAtom } from "jotai";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import { showOverlayAtom } from "@/containers/overlay/store";
import SearchableList from "@/containers/searchable-list";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SIDEBAR_POPOVER_CLASS } from "@/constants";
import useSettings from "@/hooks/use-settings";
import { getSettingsFilters } from "@/lib/utils";
import {
  getSelectedVisualizationOption,
  isSimpleChartSettings,
} from "@/containers/sidebar/projections-settings/utils";

interface Props {
  breakdown: string | null;
  setBreakdown: (value: string | null) => void;
}

const BreakdownSelector: FC<Props> = ({ breakdown, setBreakdown }) => {
  const { settings } = useSettings();
  const { data: settingsData } =
    client.projections.getCustomProjectionSettings.useQuery(
      queryKeys.projections.settings().queryKey,
      {
        query: {
          filters: getSettingsFilters(settings),
        },
      },
      { select: (res) => res.body.data },
    );
  const [showIndicators, setShowIndicators] = useState(false);
  const setshowOverlay = useSetAtom(showOverlayAtom);
  const selectedVisualizationOption = useMemo(
    () => getSelectedVisualizationOption(settings),
    [settings],
  );
  const items =
    isSimpleChartSettings(settings) && selectedVisualizationOption?.value
      ? settingsData?.[selectedVisualizationOption.value]?.color || []
      : [];

  return (
    <Popover
      open={showIndicators}
      onOpenChange={(o) => {
        setShowIndicators(o);
        setshowOverlay(o);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="clean"
          className="inline-block h-full w-full whitespace-pre-wrap rounded-none px-4 py-3.5 text-left font-normal transition-colors hover:bg-secondary"
        >
          {breakdown ? (
            <>
              <span>Breakdown by&nbsp;</span>
              <span className="font-bold">
                {`${items.find((item) => item.value === breakdown)?.label}`}
                &nbsp;
              </span>
              <span
                className="h-full p-0 align-text-bottom text-xs transition-all hover:font-extrabold"
                onClick={(e) => {
                  e.stopPropagation();
                  setBreakdown(null);
                }}
              >
                x
              </span>
            </>
          ) : (
            <span>Add a data breakdown</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        className={SIDEBAR_POPOVER_CLASS}
      >
        <SearchableList
          items={items}
          itemKey="label"
          onItemClick={(item) => {
            setBreakdown(item.value);
            setShowIndicators(false);
            setshowOverlay(false);
          }}
          maxHeight={220}
        />
      </PopoverContent>
    </Popover>
  );
};

export default BreakdownSelector;
