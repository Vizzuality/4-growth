export type SimpleProjection = {
  year: number;
  vertical: number;
};

export type BubbleProjection = {
  year: number;
  bubble: string | number;
  color: string | number;
  vertical: number;
  horizontal: number;
};

export type CustomProjection = SimpleProjection[] | BubbleProjection[];
