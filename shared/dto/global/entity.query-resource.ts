import { z } from 'zod';

export interface EntityQueryResource {
  fields?: string[];
  omitFields?: string[];
  include?: string[];
  filter?: Record<string, string | string[]>;
}

export function generateQuerySchema<
  FIELDS extends string,
  INCLUDES extends string,
  FILTERS extends string,
  OMIT_FIELDS extends string,
  SORT_BY extends string,
>(config: {
  fields: readonly FIELDS[];
  includes: readonly INCLUDES[];
  filters: readonly FILTERS[];
  omitFields: readonly OMIT_FIELDS[];
  sortBy: readonly SORT_BY[];
}) {
  const sortFields = config.sortBy.flatMap(
    (field) => [field, `-${field}`] as const,
  );
  return z.object({
    pageSize: z.number().optional(),
    pageNumber: z.number().optional(),
    disablePagination: z.boolean().optional(),
    fields: z.array(z.enum(config.fields as [FIELDS, ...FIELDS[]])).optional(),
    omitFields: z
      .array(z.enum(config.omitFields as [OMIT_FIELDS, ...OMIT_FIELDS[]]))
      .optional(),
    include: z
      .array(z.enum(config.includes as [INCLUDES, ...INCLUDES[]]))
      .optional(),
    sort: z.array(z.enum(sortFields as [SORT_BY, ...SORT_BY[]])).optional(),
    filter: z
      .record(
        z.enum(config.filters as [FILTERS, ...FILTERS[]]),
        z.union([z.string(), z.array(z.string())]),
      )
      .optional(),
  });
}
