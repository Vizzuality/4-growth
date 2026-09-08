import { FC, forwardRef, PropsWithChildren } from "react";

import { PageFilter } from "@shared/dto/widgets/page-filter.entity";

import {
  DATA_SOURCE_FILTER_NAME,
  getDataSourceOptionLabel,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

import { FilterQueryParam } from "@/hooks/use-filters";

import DataSourceInfoButton from "@/containers/filter/data-source-info";
import DataSourceFilterLabel from "@/containers/filter/data-source-label";
import FilterItemButton from "@/containers/sidebar/filter-settings/button";
import { LOCKED_SECTOR_REASON } from "@/containers/sidebar/filter-settings/constants";

import { Button, ButtonProps } from "@/components/ui/button";

interface FilterRowFrameProps {
  name: string;
  locked: boolean;
  reasonId: string;
}

/**
 * Wraps the row so the data-source help button can sit over it: it has to stay
 * outside the trigger, since a button cannot contain another button.
 */
export const FilterRowFrame: FC<PropsWithChildren<FilterRowFrameProps>> = ({
  name,
  locked,
  reasonId,
  children,
}) => (
  <div className="relative">
    {children}
    {name === DATA_SOURCE_FILTER_NAME && (
      <DataSourceInfoButton className="absolute right-4 top-1/2 -translate-y-1/2 text-white" />
    )}
    {locked && (
      <span id={reasonId} className="sr-only">
        {LOCKED_SECTOR_REASON}
      </span>
    )}
  </div>
);

interface FilterRowButtonProps extends ButtonProps {
  name: string;
  filters: PageFilter[];
  selectedFilter?: FilterQueryParam;
  locked: boolean;
  reasonId: string;
  label?: {
    selected: string;
    unSelected: string;
  };
  onRemoveFilterValue: (name: string, valueToRemove: string) => void;
}

/**
 * Shared by the desktop sidebar and the mobile sheet, which differ only in what
 * they wrap this in — a Popover or a Sheet.
 */
export const FilterRowButton = forwardRef<
  HTMLButtonElement,
  FilterRowButtonProps
>(
  (
    {
      name,
      filters,
      selectedFilter,
      locked,
      reasonId,
      label,
      onRemoveFilterValue,
      ...buttonProps
    },
    ref,
  ) => {
    const isDataSource = name === DATA_SOURCE_FILTER_NAME;
    const isComparingSources =
      isDataSource && (selectedFilter?.values.length ?? 0) > 1;

    return (
      <Button
        ref={ref}
        variant="clean"
        aria-disabled={locked || undefined}
        aria-describedby={locked ? reasonId : undefined}
        title={locked ? LOCKED_SECTOR_REASON : undefined}
        className={cn(
          "inline-block h-full w-full whitespace-pre-wrap rounded-none px-4 py-3.5 text-left font-normal transition-colors hover:bg-secondary",
          isDataSource && "pr-10",
          locked && "cursor-default opacity-60 hover:bg-transparent",
        )}
        {...buttonProps}
      >
        {selectedFilter ? (
          <>
            <span className="inline-block">
              {label?.selected ??
                filters.find((f) => f.name === selectedFilter.name)?.label}{" "}
              {isComparingSources ? (
                <DataSourceFilterLabel values={selectedFilter.values} />
              ) : (
                <FilterItemButton
                  value={selectedFilter.values[0]}
                  displayValue={
                    isDataSource
                      ? getDataSourceOptionLabel(selectedFilter.values)
                      : undefined
                  }
                  removable={!isDataSource && !locked}
                  onClick={(value) => onRemoveFilterValue(name, value)}
                />
              )}
            </span>
            {!isDataSource && (
              <ul>
                {selectedFilter.values.slice(1).map((v) => (
                  <li key={`selected-filter-${v}`}>
                    <FilterItemButton
                      value={v}
                      onClick={(value) => onRemoveFilterValue(name, value)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          label?.unSelected || name
        )}
      </Button>
    );
  },
);

FilterRowButton.displayName = "FilterRowButton";
