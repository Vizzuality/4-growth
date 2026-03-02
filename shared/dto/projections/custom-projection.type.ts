export type SimpleProjection = {
  [unit: string]: {
    year: number;
    vertical: number;
    color: string;
  }[];
};

export type BubbleProjection = {
  [unit: string]: {
    year: number;
    bubble: string | number;
    color: string | number;
    vertical: number;
    horizontal: number;
    size: number;
  }[];
};

export type TableProjection = {
  [unit: string]: {
    year: number;
    value: number;
  }[];
};

export type BreakdownProjection = {
  [unit: string]: Array<{
    label: string;
    data: Array<{
      label: string;
      value: number;
      total: number;
    }>;
  }>;
};

export type CustomProjection =
  | SimpleProjection
  | BubbleProjection
  | TableProjection
  | BreakdownProjection;
