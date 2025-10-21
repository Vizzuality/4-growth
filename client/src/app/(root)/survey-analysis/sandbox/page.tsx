import BottomBar from "@/containers/bottom-bar";
import FiltersSheet from "@/containers/bottom-bar/survey-analysis/filters-sheet";
import SettingsSheet from "@/containers/bottom-bar/survey-analysis/settings-sheet/sandbox";
import Sandbox from "@/containers/sandbox";

export default async function SandboxPage() {
  return (
    <>
      <Sandbox />
      <BottomBar>
        <SettingsSheet />
        <FiltersSheet withDataBreakdown />
      </BottomBar>
    </>
  );
}
