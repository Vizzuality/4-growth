import { CATEGORY_FILTER_NAME } from "@/lib/constants";
import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { normalizeProjectionsFilterValues } from "@/lib/utils";

import useProjectionsCategoryFilter from "@/hooks/use-category-filter";

export default function useProjectionsFilters({ enabled = true } = {}) {
  const { selectedCategories } = useProjectionsCategoryFilter();
  const operationArea = selectedCategories[0];

  return client.projections.getProjectionsFilters.useQuery(
    queryKeys.projections.filters(operationArea).queryKey,
    {
      query: operationArea
        ? {
            filters: [
              {
                name: CATEGORY_FILTER_NAME,
                operator: "=",
                values: [operationArea],
              },
            ],
          }
        : {},
    },
    {
      select: (res) => normalizeProjectionsFilterValues(res.body.data),
      enabled: enabled && !!operationArea,
      keepPreviousData: true,
    },
  );
}
