export type CustomProjection =
  | {
      year: number;
      vertical: number;
    }
  | {
      year: number;
      bubble: string | number;
      color: string | number;
      vertical: number;
      horizontal: number;
    };
