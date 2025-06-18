import { SVGProps } from "react";

const Check = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <rect width="16" height="16" fill="white" fill-opacity="0.01" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.467 3.72696C11.7559 3.91586 11.837 4.3032 11.6481 4.5921L7.39811 11.0921C7.29795 11.2453 7.13568 11.3468 6.95414 11.37C6.77259 11.3932 6.59001 11.3356 6.45458 11.2125L3.70458 8.71253C3.44917 8.48034 3.43035 8.08506 3.66254 7.82965C3.89473 7.57424 4.29001 7.55541 4.54542 7.78761L6.75304 9.79453L10.6019 3.90804C10.7908 3.61914 11.1781 3.53807 11.467 3.72696Z"
        fill="white"
        stroke="white"
      />
    </svg>
  );
};

export default Check;
