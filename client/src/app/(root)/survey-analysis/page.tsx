import BottomBar from "@/containers/bottom-bar";
import DataSourceLegend from "@/containers/bottom-bar/data-source-legend";
import FiltersSheet from "@/containers/bottom-bar/filters-sheet";
import FilterSettings from "@/containers/bottom-bar/survey-analysis/filters-sheet/filter-settings";
import Explore from "@/containers/explore/survey-analysis";
import { SURVEY_ANALYSIS_DEFAULT_FILTERS } from "@/containers/sidebar/filter-settings/constants";

export default function ExplorePage() {
  return (
    <>
      <Explore />
      <BottomBar legend={<DataSourceLegend />} inlineExternalLinks>
        <FiltersSheet>
          <FilterSettings defaultFilters={SURVEY_ANALYSIS_DEFAULT_FILTERS} />
        </FiltersSheet>
      </BottomBar>
    </>
  );
}
