import { ChangeEvent, FC, useState } from "react";

import { PageFilter } from "@shared/dto/widgets/page-filter.entity";
import Fuse from "fuse.js";
import { useSetAtom } from "jotai";
import { SearchIcon } from "lucide-react";

import {
  currentFilterAtom,
  currentStepAtom,
  FilterSelectStep,
} from "@/containers/filter/filter-select/store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const FilterSelectName: FC<{ items: PageFilter[] }> = ({ items }) => {
  const [filters, setFilters] = useState(items);
  const setCurrentFilter = useSetAtom(currentFilterAtom);
  const setCurrentStep = useSetAtom(currentStepAtom);

  const fuse = (value: string) => {
    const config = {
      threshold: 0.3,
      keys: ["name"],
    };

    return new Fuse(filters, config).search(value);
  };

  const handleOnInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;

    if (searchValue.length === 0) {
      setFilters(items);
      return;
    }

    const result = fuse(searchValue);
    setFilters(result.map((o) => o.item));
  };

  return (
    <>
      <div className="relative w-full">
        <Input
          type="search"
          variant="secondary"
          className="px-4 py-1 pr-10"
          onChange={handleOnInputChange}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 transform">
          <SearchIcon size={18} className="text-popover-foreground" />
        </div>
      </div>
      <Separator />
      <div className="relative flex h-full flex-col overflow-y-auto">
        {filters.map((f) => (
          <Button
            key={`filter-select-name-${f.name}`}
            variant="clean"
            className="cursor-pointer justify-start rounded-none px-4 py-1 text-xs font-medium transition-colors hover:bg-slate-100"
            onClick={() => {
              setCurrentFilter(f);
              setCurrentStep(FilterSelectStep.values);
            }}
          >
            {f.name}
          </Button>
        ))}
      </div>
    </>
  );
};

export default FilterSelectName;
