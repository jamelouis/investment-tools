// components/StockStatsChart.tsx
import React from "react";
import { Line } from "@ant-design/plots";
import { TransformedData } from "../types";
import MarketSentimentChart from "./MarketSentimentChart";

interface StockStatsChartProps {
  data: TransformedData[];
  latestStats: { up: number; flat: number; down: number };
}

const StockStatsChart: React.FC<StockStatsChartProps> = ({
  data,
  latestStats,
}) => {
  const config = {
    data,
    xField: "date",
    yField: "value",
    colorField: "name",
    legend: { position: "top" },
    smooth: true,
    scale: {
      y: { nice: true },
      color: {
        domain: ["up", "flat", "down", "total"],
        range: ["#F44336", "#5f5f5f", "#4CAF50", "#000000"],
      },
    },
  };

  return (
    <>
      <div className="flex justify-center">
        <MarketSentimentChart
          up={latestStats.up}
          flat={latestStats.flat}
          down={latestStats.down}
        />
      </div>
      <Line {...config} />
    </>
  );
};

export default StockStatsChart;
