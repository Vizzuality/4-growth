import { ChangeEvent, FC, useState } from "react";

import { useForm } from "react-hook-form";

import { WidgetDataFilterOperatorType } from "@shared/dto/global/search-widget-data-params";
import { PageFilter } from "@shared/dto/widgets/page-filter.entity";
import Fuse from "fuse.js";
import { useAtomValue, useSetAtom } from "jotai";
import { SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  currentFilterAtom,
  currentStepAtom,
  FilterSelectStep,
} from "@/containers/filter/filter-select/store";

import TriangleDown from "@/components/icons/triangle-down";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export interface FilterSelectForm {
  values: string[];
  operator: WidgetDataFilterOperatorType;
}

export interface FilterSelectValuesProps {
  items: PageFilter[];
  defaultValues: string[];
  isFixedFilter?: boolean;
  onSubmit: (values: FilterSelectForm) => void;
}

const FilterSelectValues: FC<FilterSelectValuesProps> = ({
  items,
  defaultValues,
  isFixedFilter,
  onSubmit,
}) => {
  const filter = useAtomValue(currentFilterAtom);
  const allValues = items.find((i) => i.name === filter?.name)?.values || [];
  const setCurrentStep = useSetAtom(currentStepAtom);
  const [selectAll, setSelectAll] = useState(false);
  const form = useForm<FilterSelectForm>({
    defaultValues: { values: defaultValues, operator: "=" },
  });
  const selectedValues = form.watch("values");
  const [formItems, setFormitems] = useState<string[]>(allValues);

  const fuse = (value: string) => {
    const config = {
      threshold: 0.3,
    };

    return new Fuse(allValues, config).search(value);
  };

  const handleOnInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;

    if (searchValue.length === 0) {
      setFormitems(allValues);
      return;
    }

    const result = fuse(searchValue);

    setFormitems(result.map((o) => o.item));
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      form.setValue("values", allValues);
    } else {
      form.setValue("values", []);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <Button
        type="button"
        variant="clean"
        className="justify-between rounded-none px-3 py-4 transition-colors hover:bg-slate-100 disabled:bg-transparent disabled:text-inherit"
        onClick={() => {
          setCurrentStep(FilterSelectStep.name);
        }}
        disabled={isFixedFilter}
      >
        <span className="text-xs font-medium">{filter?.name}</span>
        <TriangleDown aria-hidden="true" />
      </Button>
      <Form {...form}>
        <form
          className="flex h-full min-h-0 flex-col bg-slate-100"
          onSubmit={form.handleSubmit((f) => onSubmit(f))}
        >
          {allValues.length > 15 && (
            <div className="relative w-full border-t border-bluish-gray-500 border-opacity-35">
              <Input
                type="search"
                variant="secondary"
                className="h-10 py-4 pl-3 pr-10"
                onChange={handleOnInputChange}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 transform">
                <SearchIcon size={18} className="text-popover-foreground" />
              </div>
              <div className="px-4">
                <Separator className="bg-bluish-gray-500 bg-opacity-35" />
              </div>
            </div>
          )}
          <FormField
            control={form.control}
            name="values"
            render={({ field }) => (
              <ScrollArea maxHeight={220}>
                <FormItem>
                  {allValues.length && (
                    <FormItem className="flex h-10 items-center justify-between gap-2 space-y-0 pr-3 transition-colors hover:bg-slate-200">
                      <FormLabel className="flex-1 translate-y-0 cursor-pointer select-none py-4 pl-3 pr-0 text-xs font-medium">
                        Select All
                      </FormLabel>
                      <FormControl>
                        <Checkbox
                          variant="secondary"
                          className="data-[state=unchecked]:hidden"
                          checked={selectAll}
                          onCheckedChange={handleSelectAll}
                        />
                      </FormControl>
                    </FormItem>
                  )}

                  {formItems.map((v) => (
                    <FormItem
                      key={`filter-select-value-${v}`}
                      className="flex h-10 items-center justify-between gap-2 space-y-0 pr-3 transition-colors hover:bg-slate-200"
                    >
                      <FormLabel className="flex-1 translate-y-0 cursor-pointer select-none py-4 pl-3 pr-0 text-xs font-medium">
                        {v}
                      </FormLabel>
                      <FormControl>
                        <Checkbox
                          variant="secondary"
                          className="data-[state=unchecked]:hidden"
                          checked={field.value?.includes(v) || false}
                          onCheckedChange={(checked) => {
                            const updatedValues = checked
                              ? [...(field.value || []), v]
                              : (field.value || []).filter(
                                  (value: string) => value !== v,
                                );
                            field.onChange(updatedValues);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  ))}
                </FormItem>
              </ScrollArea>
            )}
          />
          <div
            className={cn(
              "border-t-bluish-gray-500/35 bg-white p-0.5 pt-2",
              selectedValues.length === 0 ? "hidden" : "block",
            )}
          >
            <Button className="w-full" type="submit">
              Apply
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FilterSelectValues;
