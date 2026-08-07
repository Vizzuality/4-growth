import { SproutIcon, TreePineIcon } from "lucide-react";

export const PROJECTIONS_CATEGORIES = [
  {
    label: "Forestry",
    value: "Forestry",
    icon: <TreePineIcon className="fill-current" />,
  },
  {
    label: "Agriculture",
    value: "Agriculture",
    icon: <SproutIcon className="fill-current" />,
  },
] as const;
