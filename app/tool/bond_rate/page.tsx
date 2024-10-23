"use client";
import { Line } from "@ant-design/plots";
import { Bond_Rate_CSV_URL, useCSVData } from "@/app/utils/constant";
import ReactECharts from "echarts-for-react";
import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hook/use-mobile";
import FullScreenWrapper from "@/app/components/FullScreenWrapper";
import { Skeleton } from "@/components/ui/skeleton";

const MonthlyBondYieldChart = ({ data, timeRange }) => {
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
        if(!monthlyData[monthKey]) {
          monthlyData[monthKey] = { ...row };
          monthlyData[monthKey]['日期'] = monthKey;
        }
        Object.keys(row).forEach((key) => {
          if (key !== "日期" && row[key] !== '' && !isNaN(parseFloat(row[key]))) {
            monthlyData[monthKey][key] =
              parseFloat(row[key]);
          }
        });
      }
    });

    return Object.values(monthlyData).sort((a, b) =>
      a["日期"].localeCompare(b["日期"]),
    );
  }, [data]);

  const filterData = timeRange > 0 ? sampledData.slice(-timeRange) : sampledData;

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
      source: filterData, 
    },
    legend: {
      type: "scroll",
      orient: "horizontal",
      //right: 10,
      top: "top",
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        fontSize: 12,
      },
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
      data: filterData.map((item) => item["日期"]),
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

  return <ReactECharts option={option} />;
};

// Usage
const BondRate = () => {
  const { data, error } = useCSVData(Bond_Rate_CSV_URL, (d) => d);
  const [ timeRange, setTimeRange ] = useState(-1);
  const  isMobile = useIsMobile();

  if (error) return <p>{error}</p>;

  return (
    <div className="flex md:items-center justify-center container md:h-screen m-auto px-4 py-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">中美月度国债收益率</CardTitle>
          <CardDescription className="text-center">2年、5年、10年、全部的中美国债收益率</CardDescription>
        </CardHeader>
        <CardContent>
          { !data ? (
            <div className="flex items-center justify-center m-4">
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            </div>
           ) : (
            <FullScreenWrapper isRotate={isMobile}>
                <MonthlyBondYieldChart data={data} timeRange={timeRange}/>
            </FullScreenWrapper>
           )
          }
          <div className="w-full flex justify-center gap-4">
            <Button 
              variant={timeRange === 36 ? "default" : "outline"}
              onClick={() => setTimeRange(36)}
            >
              3 年 
            </Button>
            <Button 
              variant={timeRange === 60 ? "default" : "outline"}
              onClick={() => setTimeRange(60)}
            >
              5 年 
            </Button>
            <Button 
              variant={timeRange === 120 ? "default" : "outline"}
              onClick={() => setTimeRange(120)}
            >
              10 年 
            </Button>
            <Button 
              variant={timeRange === -1 ? "default" : "outline"}
              onClick={() => setTimeRange(-1)}
            >
              全部
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BondRate;
