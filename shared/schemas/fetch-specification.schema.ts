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
  filter: z.record(z.unknown()).optional(),
});
