import { SVGProps } from "react";

const Rows2 = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <rect width="16" height="16" fill="currentColor" fillOpacity="0.01" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.5 2H14.5C14.7761 2 15 2.22386 15 2.5V8H1V2.5C1 2.22386 1.22386 2 1.5 2ZM1 9V13.5C1 13.7761 1.22386 14 1.5 14H14.5C14.7761 14 15 13.7761 15 13.5V9H1ZM0 2.5C0 1.67157 0.671573 1 1.5 1H14.5C15.3284 1 16 1.67157 16 2.5V13.5C16 14.3284 15.3284 15 14.5 15H1.5C0.671573 15 0 14.3284 0 13.5V2.5Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default Rows2;
