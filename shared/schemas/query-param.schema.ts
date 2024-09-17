import { z } from 'zod';

export const FetchSpecificationSchema = z.object({
  pageSize: z.coerce.number().optional(),
  pageNumber: z.coerce.number().optional(),
  disablePagination: z.coerce.boolean().optional(),
  fields: z.array(z.string()).optional(),
  omitFields: z.array(z.string()).optional(),
  include: z.array(z.string()).optional(),
  sort: z.array(z.string()).optional(),
  filter: z.record(z.unknown()).optional(),
});
