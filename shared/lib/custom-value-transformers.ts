import { ValueTransformer } from 'typeorm';

const semiColonSeparator: ValueTransformer = {
  from: (value: string): string[] => (value ? value.split(';') : []),
  to: (value: string[]): string => (value ? value.join(';') : ''),
};

export const CustomValueTransformers = {
  semiColonSeparator,
} as const;
