import DiamondLine from "@/components/icons/diamond-line";
import Rocket from "@/components/icons/rocket";
import Rows2 from "@/components/icons/rows-2";
import Sun from "@/components/icons/sun";

export const SCENARIOS = [
  {
    label: "Baseline",
    value: "baseline",
    icon: <Rows2 className="fill-current" />,
  },
  {
    label: "Reimagining Progress",
    value: "reimagining-progress",
    icon: <Sun className="fill-current" />,
  },
  {
    label: "The Fractured Continent",
    value: "fractured-continent",
    icon: <DiamondLine className="fill-current" />,
  },
  {
    label: "The Corporate Epoch",
    value: "corporate-epoch",
    icon: <Rocket className="fill-current" />,
  },
];
