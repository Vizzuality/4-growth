import BottomBar from "@/containers/bottom-bar";
import CategorySheet from "@/containers/bottom-bar/category-sheet";
import FilterSettings from "@/containers/bottom-bar/projections/filter-settings";
import FiltersSheet from "@/containers/bottom-bar/projections/filters-sheet";
import ScenariosSheet from "@/containers/bottom-bar/projections/scenarios-sheet";
import Explore from "@/containers/explore/projections";
import { PROJECTIONS_DEFAULT_FILTERS } from "@/containers/sidebar/filter-settings/constants";

export default function ProjectionsPage() {
  return (
    <>
      <Explore />
      <BottomBar>
        <CategorySheet />
        <ScenariosSheet />
        <FiltersSheet>
          <FilterSettings defaultFilters={PROJECTIONS_DEFAULT_FILTERS} />
        </FiltersSheet>
      </BottomBar>
    </>
  );
}
