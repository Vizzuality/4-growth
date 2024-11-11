import { SVGProps } from "react";

export const TriangleDown = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-testid="triangle-down-icon"
      {...props}
    >
      <g>
        <path
          id="Vector"
          d="M4.26666 6.40001L11.7333 6.40001L8 11.2L4.26666 6.40001Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
};

export default TriangleDown;
