import BottomBar from "@/containers/bottom-bar";
import FiltersSheet from "@/containers/bottom-bar/projections/filters-sheet";
import ScenariosSheet from "@/containers/bottom-bar/projections/scenarios-sheet";
import Explore from "@/containers/explore/projections";

export default function ProjectionsPage() {
  return (
    <>
      <Explore />
      <BottomBar>
        <ScenariosSheet />
        <FiltersSheet />
      </BottomBar>
    </>
  );
}
