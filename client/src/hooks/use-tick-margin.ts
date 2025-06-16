import { RefObject, useEffect, useState } from "react";

export default function useTickMargin(chartRef: RefObject<HTMLDivElement>) {
  const [tickMargin, setTickMargin] = useState<number>(0);

  useEffect(() => {
    const updateTickMargin = () => {
      if (chartRef.current) {
        const chartHeight = chartRef.current.clientHeight;
        setTickMargin(-(chartHeight * 0.2));
      }
    };

    updateTickMargin();
    window.addEventListener("resize", updateTickMargin);

    return () => {
      window.removeEventListener("resize", updateTickMargin);
    };
  }, [chartRef]);

  return tickMargin;
}
