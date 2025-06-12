import { SVGProps } from "react";

interface CustomCellProps extends SVGProps<SVGElement> {
  radius?: number | string | [number, number, number, number];
}

declare module "recharts" {
  export const Cell: React.FC<CustomCellProps>;
}
