import { SVGProps } from "react";

export const NoData = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g opacity="0.5">
        <path
          d="M52 38V31V22M52 22C49.136 22 45.387 22 43 22H39C38.2044 22 36 22 36 22C36 22 36 19.7956 36 19V15C36 12.6131 36 6 36 6M52 22C52 22 52 26.8347 52 30V51.9633M52 22L44.5 14.5L36 6M36 6C34.0322 6 29.2861 6 28 6H15H12V11.8899M36 6C33.9289 6 28.3191 6 27 6H22M20 40H24.25L30 40M20 48L37.7419 48M50.0323 58H15C13.344 58 12 58 12 58V20.1613"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.87207 5.87158L58.1289 58.1285"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default NoData;
