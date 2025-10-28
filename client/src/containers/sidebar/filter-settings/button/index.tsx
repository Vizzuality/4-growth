import type { FC } from "react";

import { CircleXIcon } from "lucide-react";

const FilterItemButton: FC<{
  value: string;

  onClick: (value: string) => void;
}> = ({ value, onClick }) => {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="font-bold">{value}&nbsp;</span>
      <CircleXIcon
        className="h-4 w-4 transition-colors hover:text-white/80"
        onClick={(e) => {
          e.stopPropagation();
          onClick(value);
        }}
      />
    </span>
  );
};

export default FilterItemButton;
