import { z } from 'zod';

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
  sort: readonly SORT_BY[];
}) {
  type SortField = SORT_BY | `-${SORT_BY}`;
  const sortFields = config.sort.flatMap(
    (field) => [field, `-${field}`] as const,
  ) as readonly SortField[];
  return z.object({
    pageSize: z
      .number()
      .optional()
      .refine((n) => n === undefined || n > 0, {
        message: 'Page size must be a positive number',
      }),
    pageNumber: z
      .number()
      .optional()
      .refine((n) => n === undefined || n > 0, {
        message: 'Page number must be a positive number',
      }),
    disablePagination: z.boolean().optional(),
    fields: z
      .array(z.enum(config.fields as [FIELDS, ...FIELDS[]]))
      .optional()
      .refine((arr) => arr?.every((field) => config.fields.includes(field)), {
        message: `Invalid field specified. Available fields: ${config.fields.join(', ')} `,
      }),
    omitFields: z
      .array(z.enum(config.omitFields as [OMIT_FIELDS, ...OMIT_FIELDS[]]))
      .optional()
      .refine(
        (arr) => arr?.every((field) => config.omitFields.includes(field)),
        {
          message: `Invalid omit field specified: Available omit fields: ${config.omitFields.join(', ')}`,
        },
      ),
    include: z
      .array(z.enum(config.includes as [INCLUDES, ...INCLUDES[]]))
      .optional(),
    sort: z
      .array(z.enum(sortFields as [SortField, ...SortField[]]))
      .optional()
      .refine(
        (arr) =>
          arr?.every(
            (field) =>
              config.sort.includes(field as SORT_BY) ||
              config.sort.includes(field.slice(1) as SORT_BY),
          ),
        {
          message: `Invalid sorting field specified. Available sort fields: ${config.sort.join(
            ', ',
          )} (with optional '-' prefix)`,
        },
      ),
    filter: z
      .record(
        z.enum(config.filters as [FILTERS, ...FILTERS[]]),
        z.union([z.string(), z.array(z.string())]),
      )
      .optional(),
  });
}
