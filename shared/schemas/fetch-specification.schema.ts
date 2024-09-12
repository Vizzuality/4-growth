import { z } from 'zod';

export const FetchSpecificationSchema = z.object({
  /**
   * @type {string} - Test Page
   */
  pageSize: z.number().optional(),
  /**
   * @type {number} - Test number
   */
  pageNumber: z.number().optional(),
  disablePagination: z.boolean().optional(),
  fields: z.array(z.string()).optional(),
  omitFields: z.array(z.string()).optional(),
  include: z.array(z.string()).optional(),
  sort: z.array(z.string()).optional(),
  filter: z.object({}),
});

export function generateQuerySchema<
  FIELDS extends string,
  INCLUDES extends string,
  FILTERS extends string,
>(config: {
  fields: readonly FIELDS[];
  includes: readonly INCLUDES[];
  filters: readonly FILTERS[];
}) {
  return z.object({
    pageSize: z.number().optional(),
    pageNumber: z.number().optional(),
    disablePagination: z.boolean().optional(),
    fields: z.array(z.enum(config.fields as [FIELDS, ...FIELDS[]])).optional(),
    omitFields: z
      .array(z.enum(config.fields as [FIELDS, ...FIELDS[]]))
      .optional(),
    include: z
      .array(z.enum(config.includes as [INCLUDES, ...INCLUDES[]]))
      .optional(),
    sort: z.array(z.string()).optional(),
    filter: z
      .record(
        z.enum(config.filters as [FILTERS, ...FILTERS[]]),
        z.union([z.string(), z.array(z.string())]),
      )
      .optional(),
  });
}
