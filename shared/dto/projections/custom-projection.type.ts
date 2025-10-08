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

export type CustomProjection = SimpleProjection | BubbleProjection;
