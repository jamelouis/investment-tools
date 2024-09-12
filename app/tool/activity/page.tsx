"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import LineChartWithBrush from "@/app/components/LineChart";
import SunburstChart from "@/app/components/SunburstChart";
import FullScreenWrapper from "@/app/components/FullScreenWrapper";
import {
  Transaction_CSV_URL,
  INDEX_CSV_URL,
  Asset_CSV_URL,
  useCSVData,
  analyzeData,
  processMonthlyData,
  generateSunburstData,
  activity_references,
} from "@/app/utils/constant";
import StackedBarChart from "@/app/components/StackedBarChart";
import * as d3 from "d3";
import ReferenceList from "@/app/components/ReferenceList";

const IndexVisualization = React.memo(
  ({ url, activityData, onMarkClicked, range }) => {
    const row = useCallback((d) => {
      d.date = new Date(d.date);
      d.value = +d.close;
      return d;
    }, []);

    const { data, error } = useCSVData(url, row);

    const mark = useMemo(() => {
      if (!data) return [];
      return activityData
        .map((a) => {
          const dataPoint = data.find(
            (d) => d.date.getTime() === a.date.getTime(),
          );
          return dataPoint
            ? {
                date: dataPoint.date,
                value: dataPoint.value,
                url: a.articleLink,
              }
            : null;
        })
        .filter((point) => point !== null);
    }, [data, activityData]);

    if (error) return <p className="text-red-500">{error}</p>;
    if (!data) return <p className="text-gray-500">Loading...</p>;

    return (
      <LineChartWithBrush
        data={data}
        mark={mark}
        onMarkClicked={onMarkClicked}
        range={range}
      />
    );
  },
);

const YearlyChart = React.memo(({ data, onBrushed }) => (
  <FullScreenWrapper>
    <h3 className="text-center text-sm">年度直方图</h3>
    <StackedBarChart data={data} enableBrush={true} onBrushed={onBrushed} />
  </FullScreenWrapper>
));

const MonthlyChart = React.memo(({ data, onClick }) => (
  <FullScreenWrapper>
    <h3 className="text-center text-sm">月度直方图</h3>
    <StackedBarChart data={data} onClick={onClick} />
  </FullScreenWrapper>
));

export default function Activity() {
  const row = useCallback((d) => {
    d.date = new Date(d.date);
    d.tradeUnit = +d.tradeUnit;
    return d;
  }, []);

  const { data: activityData, error: activityError } = useCSVData(
    Transaction_CSV_URL,
    row,
  );
  const { data: assetsData, error: assetsError } = useCSVData(
    Asset_CSV_URL,
    (d) => d,
  );

  const [filterYear, setFilterYear] = useState(null);
  const [articleLink, setArticleLink] = useState("");
  const [filterData, setFilterData] = useState(null);

  const currentYear = new Date().getFullYear();
  const now = new Date();
  const [range, setRange] = useState([new Date(currentYear, 0, 1), now]);

  const sunburstData = useMemo(() => {
    if (!assetsData) return null;
    return generateSunburstData(assetsData);
  }, [assetsData]);

  const yearData = useMemo(() => {
    if (!activityData) return [];
    const filteredData =
      filterData === null
        ? activityData
        : activityData.filter((item) =>
            filterData.codes.includes(item.fundCode),
          );
    return analyzeData(filteredData, d3.timeFormat("%Y"), (d) =>
      d.date.getFullYear(),
    );
  }, [activityData, filterData]);

  const monthlyData = useMemo(() => {
    if (!activityData) return [];
    const filteredData =
      filterData === null
        ? activityData
        : activityData.filter((item) =>
            filterData.codes.includes(item.fundCode),
          );
    const monthlyData = processMonthlyData(filteredData);
    return filterYear
      ? monthlyData.filter(
          (md) =>
            new Date(md.date) > new Date(filterYear[0], 11, 31) &&
            new Date(md.date) <= new Date(filterYear[1], 11, 31),
        )
      : monthlyData;
  }, [activityData, filterData, filterYear]);

  const handleSunburstClick = useCallback((data) => {
    console.log(data.name);
    setFilterData(data);
  }, []);

  const handleMonthClick = useCallback((date) => {
    const [year, month] = date.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    setRange([startDate, endDate]);
  }, []);

  if (activityError || assetsError)
    return <p className="text-red-500">{activityError || assetsError}</p>;
  if (!activityData || !assetsData)
    return <p className="text-gray-500">Loading...</p>;

  console.log(assetsData);

  return (
    <div className="flex flex-col max-w-7xl m-auto min-h-screen">
      <h2 className="text-center font-bold text-2xl pt-6 pb-3">ETF150 发车</h2>
      <div className="flex flex-col md:flex-row w-full">
        <FullScreenWrapper className="flex-1 p-4">
          <div className="max-w-4xl m-auto">
            <h3 className="text-center text-sm">资产配置图</h3>
            <SunburstChart data={sunburstData} onClick={handleSunburstClick} />
          </div>
        </FullScreenWrapper>
        <div className="flex-1 p-4">
          <YearlyChart data={yearData} onBrushed={setFilterYear} />
          <MonthlyChart data={monthlyData} onClick={handleMonthClick} />
        </div>
      </div>
      <FullScreenWrapper className="flex-1 p-4">
        <h3 className="text-center text-sm">深综指与发车记录</h3>
        <IndexVisualization
          url={INDEX_CSV_URL}
          activityData={activityData}
          onMarkClicked={setArticleLink}
          range={range}
        />
      </FullScreenWrapper>
      <ReferenceList references={activity_references} />
    </div>
  );
}
