import { FC } from "react";

const NoData: FC = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <p className="font-semibold">No data</p>
      <p className="text-xs">There was no data found for this visualization</p>
    </div>
  );
};

export default NoData;
