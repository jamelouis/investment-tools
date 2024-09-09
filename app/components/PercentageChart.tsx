// components/PercentageChart.tsx
import React from "react";
import BoxplotWithHistogramChart from "./BoxplotWithHistogramChart";
import FullScreenWrapper from "./FullScreenWrapper";

interface PercentageChartProps {
  data: { current_year_percent: number; percent: number }[];
  date: string;
}

const PercentageChart: React.FC<PercentageChartProps> = ({ data, date }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FullScreenWrapper className="bg-gray-200 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">{date}日涨跌幅</h2>
          <div className="bg-white rounded">
            <BoxplotWithHistogramChart data={data} yField="percent" />
          </div>
        </FullScreenWrapper>
        <FullScreenWrapper className="bg-gray-200 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">年初至{date}涨跌幅</h2>
          <div className="bg-white rounded">
            <BoxplotWithHistogramChart
              data={data}
              yField="current_year_percent"
            />
          </div>
        </FullScreenWrapper>
    </div>
  );
};

export default PercentageChart;
