"use client";
import { Line } from "@ant-design/plots";
import { useCSVData } from "@/app/utils/constant";
import ReactECharts from "echarts-for-react";
import React, { useMemo } from "react";

const MonthlyBondYieldChart = ({ data }) => {
  const sampledData = useMemo(() => {
    const monthlyData = {};

    // preprocess data to remove undefined data
    data.forEach((row) => {
      const date = new Date(row["日期"]);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (
        !monthlyData[monthKey] ||
        new Date(row["日期"]) > new Date(monthlyData[monthKey]["日期"])
      ) {
        monthlyData[monthKey] = { ...row };
        Object.keys(row).forEach((key) => {
          if (key !== "日期" && !isNaN(parseFloat(row[key]))) {
            monthlyData[monthKey][key] =
              parseFloat(monthlyData[monthKey][key]) || 0;
          }
        });
      }
    });

    return Object.values(monthlyData).sort((a, b) =>
      a["日期"].localeCompare(b["日期"]),
    );
  }, [data]);
  console.log(sampledData);
  /*
  const sampledData = useMemo(() => {
    const monthlyData = {};

    data.forEach((row) => {
      const date = new Date(row["日期"]);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { ...row, count: 1 };
      } else {
        Object.keys(row).forEach((key) => {
          if (key !== "日期" && !isNaN(parseFloat(row[key]))) {
            monthlyData[monthKey][key] =
              (parseFloat(monthlyData[monthKey][key]) || 0) +
              parseFloat(row[key]);
          }
        });
        monthlyData[monthKey].count += 1;
      }
    });

    return Object.entries(monthlyData)
      .map(([date, values]) => ({
        日期: date,
        ...Object.fromEntries(
          Object.entries(values).map(([key, value]) => [
            key,
            key !== "count" && key !== "日期" ? value / values.count : value,
          ]),
        ),
      }))
      .sort((a, b) => a["日期"].localeCompare(b["日期"]));
  }, [data]);

  */
  const option = {
    color: [
      // China colors (shades of red)
      "#FF4136",
      "#FF725C",
      "#FF9E7A",
      "#FFBFA0",
      // US colors (shades of blue)
      "#0074D9",
      "#4192D9",
      "#7ABAF2",
      "#A7D2FF",
    ],
    dataset: {
      source: sampledData,
    },
    title: {
      text: "月度平均国债收益率",
      left: "center",
    },
    legend: {
      type: "scroll",
      orient: "vertical",
      right: 10,
      top: "middle",
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        fontSize: 12,
      },
    },
    grid: {
      right: "15%", // Adjust this value to make space for the legend
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "#999",
        },
        lineStyle: {
          color: "#555",
          width: 1,
          type: "dashed",
        },
        label: {
          backgroundColor: "#6a7985",
        },
      },
      formatter: function (params) {
        let result = params[0].axisValue + "<br/>";
        params.forEach((param) => {
          result +=
            param.marker +
            " " +
            param.seriesName +
            ": " +
            param.value[param.seriesName] +
            "%<br/>";
        });
        return result;
      },
    },
    xAxis: {
      type: "category",
      data: sampledData.map((item) => item["日期"]),
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value}%",
      },
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
      },
      {
        start: 0,
        end: 100,
      },
    ],
    series: [
      {
        type: "line",
        name: "中国国债收益率2年",
        encode: { x: "日期", y: "中国国债收益率2年" },
        sampling: "average",
      },
      {
        type: "line",
        name: "中国国债收益率5年",
        encode: { x: "日期", y: "中国国债收益率5年" },
        sampling: "average",
      },
      {
        type: "line",
        name: "中国国债收益率10年",
        encode: { x: "日期", y: "中国国债收益率10年" },
        sampling: "average",
      },
      {
        type: "line",
        name: "中国国债收益率30年",
        encode: { x: "日期", y: "中国国债收益率30年" },
      },
      {
        type: "line",
        name: "美国国债收益率2年",
        encode: { x: "日期", y: "美国国债收益率2年" },
        sampling: "average",
      },
      {
        type: "line",
        name: "美国国债收益率5年",
        encode: { x: "日期", y: "美国国债收益率5年" },
        sampling: "average",
      },
      {
        type: "line",
        name: "美国国债收益率10年",
        encode: { x: "日期", y: "美国国债收益率10年" },
        sampling: "average",
      },
      {
        type: "line",
        name: "美国国债收益率30年",
        encode: { x: "日期", y: "美国国债收益率30年" },
        sampling: "average",
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: "600px" }} />;
};

// Usage
const BondRate = () => {
  const { data, error } = useCSVData("/csv/bond-rate.csv", (d) => d);

  if (!data) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="h-screen w-screen px-8 pt-12 m-auto">
      <MonthlyBondYieldChart data={data} />
    </div>
  );
};

export default BondRate;
