import BottomBar from "@/containers/bottom-bar";
import FiltersSheet from "@/containers/bottom-bar/survey-analysis/filters-sheet";
import Explore from "@/containers/explore/survey-analysis";

export default function ExplorePage() {
  return (
    <>
      <Explore />
      <BottomBar>
        <FiltersSheet />
      </BottomBar>
    </>
  );
}
