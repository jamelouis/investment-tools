import React from "react";
import ReactDOM from "react-dom";
import { Histogram, Box } from "@ant-design/plots";

const BoxplotWithHistogramChart = ({ data, yField }) => {
  const config = {
    height: 180,
    autoFit: true,
    inset: 45.5,
    data: data,
    boxType: "boxplot",
    yField: yField,
    coordinate: { transform: [{ type: "transpose" }] },
    style: { boxFill: "#aaa", pointStroke: "#000", pointer: false },
    outliers: false,
  };

  const config2 = {
    data: data,
    style: {
      inset: 0.5,
    },
    binField: yField,
    channel: "count",
    // 分箱数量
    binNumber: 20,
  };

  return (
    <div>
      <Box {...config} />
      <Histogram {...config2}  />
    </div>
  );
};

export default BoxplotWithHistogramChart;
