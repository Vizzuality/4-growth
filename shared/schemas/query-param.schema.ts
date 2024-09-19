import { z } from 'zod';
import { getMetadataArgsStorage } from 'typeorm';

const generateQuerySchema = <
  FIELDS extends string,
  INCLUDES extends string,
  FILTERS extends string,
  OMIT_FIELDS extends string,
  SORT extends string,
>(config: {
  fields?: readonly FIELDS[];
  includes?: readonly INCLUDES[];
  filter?: readonly FILTERS[];
  omitFields?: readonly OMIT_FIELDS[];
  sort?: readonly SORT[];
}) => {
  const fields = z
    .array(z.enum(config.fields as [FIELDS, ...FIELDS[]]))
    .optional();
  const filter = z
    .record(
      z.enum(config.filter as [FILTERS, ...FILTERS[]]),
      z.union([
        z.string().transform((value) => {
          return value.split(',');
        }),
        z.array(z.string()),
      ]),
    )
    .optional();

  const omitFields = z
    .array(z.enum(config.omitFields as [OMIT_FIELDS, ...OMIT_FIELDS[]]))
    .optional();

  const include = z
    .array(z.enum(config.includes as [INCLUDES, ...INCLUDES[]]))
    .optional();

  const sort = z.array(z.enum(config.sort as [SORT, ...SORT[]])).optional();

  return z.object({
    pageSize: z.coerce.number().optional(),
    pageNumber: z.coerce.number().optional(),
    disablePagination: z.coerce.boolean().optional(),
    fields,
    omitFields,
    include,
    sort,
    filter,
  });
};

type PropertyKeys<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T & string];

type ExtractProperties<T> = Pick<T, PropertyKeys<T>>;

type IsEntity<T> = unknown extends T // Exclude `any`
  ? never
  : T extends Date // Exclude `Date`
  ? never
  : T extends Array<infer U> // If `T` is an array, check the type of the elements
  ? IsEntity<U> extends never // If the elements are not entities, exclude the array
    ? never
    : T // Include the array if the elements are valid entities
  : T extends object // Check object types (non-arrays)
  ? T extends { constructor: Function }
    ? T // Include the object if it's a TypeORM entity
    : never
  : never;

// Utility type to extract only relationship keys (those referencing other entities that extend BaseWidget)
type RelationshipKeys<T> = {
  [K in keyof T]: IsEntity<T[K]> extends never ? never : K;
}[keyof T & string];

// Extract only relationships from a class that extend BaseWidget
type ExtractRelationships<T> = Pick<T, RelationshipKeys<T>>;

export type FieldsQueryParam<T> = Array<keyof ExtractProperties<T>>;
export type IncludesQueryParam<T> = Array<keyof ExtractRelationships<T>>;
export type FilterQueryParam<T> = Array<keyof ExtractProperties<T>>;
export type OmitFieldsQueryParam<T> = Array<keyof ExtractProperties<T>>;
export type SortQueryParam<T> = Array<
  keyof ExtractProperties<T> | `-${keyof ExtractProperties<T>}`
>;

export function generateEntityQuerySchema<T extends object>(
  entityClass: {
    new (): T;
  },
  config: {
    fields?: FieldsQueryParam<T>;
    includes?: IncludesQueryParam<T>;
    filter?: FilterQueryParam<T>;
    omitFields?: OmitFieldsQueryParam<T>;
    sort?: SortQueryParam<T>;
  } = {},
) {
  const metadata = getMetadataArgsStorage();
  const properties = metadata.columns
    .filter((t) => t.target === entityClass)
    .map((e) => e.propertyName) as Array<keyof ExtractProperties<T>>;

  const mergedEntityConfig = {
    fields: config.fields ?? properties,
    includes:
      config.includes ??
      (metadata.relations
        .filter((relation) => relation.target === entityClass)
        .map((relation) => relation.propertyName) as Array<
        keyof ExtractRelationships<T>
      >),
    filter: config.filter ?? properties,
    omitFields: config.omitFields,
    sort:
      config.sort ??
      ([...properties, ...properties.map((p) => `-${p}`)] as Array<
        keyof ExtractProperties<T> | `-${keyof ExtractProperties<T>}`
      >),
  } as const;

  return generateQuerySchema(mergedEntityConfig);
}
