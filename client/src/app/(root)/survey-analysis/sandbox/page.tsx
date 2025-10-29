import BottomBar from "@/containers/bottom-bar";
import FiltersSheet from "@/containers/bottom-bar/filters-sheet";
import FilterSettings from "@/containers/bottom-bar/survey-analysis/filters-sheet/filter-settings";
import SettingsSheet from "@/containers/bottom-bar/survey-analysis/settings-sheet/sandbox";
import Sandbox from "@/containers/sandbox";
import { SURVEY_ANALYSIS_DEFAULT_FILTERS } from "@/containers/sidebar/filter-settings/constants";

export default async function SandboxPage() {
  return (
    <>
      <Sandbox />
      <BottomBar>
        <SettingsSheet />
        <FiltersSheet>
          <FilterSettings
            defaultFilters={SURVEY_ANALYSIS_DEFAULT_FILTERS}
            withDataBreakdown
          />
        </FiltersSheet>
      </BottomBar>
    </>
  );
}
