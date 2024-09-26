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
  base_path,
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

import index from "@/data/index.json";

const IndexVisualization = ({ url, activityData, onMarkClicked, range }) => {
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
              type: a.type,
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
};

const YearlyChart = ({ data, onBrushed }) => (
  <FullScreenWrapper>
    <h3 className="text-center text-sm">年度直方图</h3>
    <StackedBarChart data={data} enableBrush={true} onBrushed={onBrushed} />
  </FullScreenWrapper>
);

const MonthlyChart = ({ data, onClick }) => (
  <FullScreenWrapper>
    <h3 className="text-center text-sm">月度直方图</h3>
    <StackedBarChart data={data} onClick={onClick} />
  </FullScreenWrapper>
);

function Activity() {
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
  const [indexUrl, setIndexUrl] = useState("399001");

  const currentYear = new Date().getFullYear();
  const now = new Date();
  const [range, setRange] = useState();

  const sunburstData = useMemo(() => {
    if (!assetsData) return null;
    return generateSunburstData(assetsData);
  }, [assetsData]);

  const filteredData =
    filterData === null || activityData === null
      ? activityData
      : activityData.filter((item) => filterData.codes.includes(item.fundCode));

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
    const monthlyData = processMonthlyData(filteredData);
    return filterYear
      ? monthlyData.filter(
          (md) =>
            new Date(md.date) > new Date(filterYear[0], 11, 31) &&
            new Date(md.date) <= new Date(filterYear[1], 11, 31),
        )
      : monthlyData;
  }, [activityData, filteredData, filterYear]);

  const handleSunburstClick = useCallback((data) => {
    setFilterData(data);
    if (data.underlying) {
      setIndexUrl(data.underlying);
    }
  }, []);

  const handleMonthClick = useCallback((date) => {
    const [year, month] = date.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    setRange([startDate, endDate]);
  }, []);

  const handleDayClick = useCallback((date) => {
    const [year, month, day] = date.split("-").map(Number);
    const startDate = new Date(year, month - 1, day - 30);
    const endDate = new Date(year, month - 1, day + 30);
    setRange([startDate, endDate]);
  }, []);

  if (activityError || assetsError)
    return <p className="text-red-500">{activityError || assetsError}</p>;
  if (!activityData || !assetsData)
    return <p className="text-gray-500">Loading...</p>;

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
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col">
            <div className="mb-4">
              <select
                id="indexSelect"
                className="block p-1 md:px-3 md:py-2  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs"
                onChange={(e) => {
                  setIndexUrl(e.target.value);
                }}
                value={indexUrl}
              >
                {index.map((item, idx) => (
                  <option key={idx} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:w-[360px] md:w-[820px]">
              <IndexVisualization
                url={base_path + "/csv/" + indexUrl + ".csv"}
                activityData={filteredData}
                onMarkClicked={setArticleLink}
                range={range}
              />
            </div>
          </div>
          <div className="hidden md:block w-80 h-[520px] overflow-y-scroll border">
            {filteredData.map((activity, index) => {
              return (
                <div
                  className={`p-1 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-green-100 hover:cursor-pointer`}
                  key={index}
                  onClick={() =>
                    handleDayClick(d3.timeFormat("%Y-%m-%d")(activity.date))
                  }
                >
                  <div className="flex flex-row items-center">
                    <span className="p-1 text-sm  mr-2">{index + 1}</span>
                    <div>
                      <p className="text-sm">
                        {d3.timeFormat("%Y-%m-%d")(activity.date)}
                        {activity.type === "buy" ? (
                          <span className=" text-xs font-bold text-red-800">
                            (买)
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-green-800">
                            (卖)
                          </span>
                        )}
                      </p>
                      <p className="text-xs">{activity.fundName}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="md:hidden h-[520px] overflow-y-scroll border">
            {filteredData.map((activity, index) => {
              return (
                <div
                  className={`px-2 pb-3 flex justify-between items-center ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                  key={index}
                >
                  <div>
                    <p className="text-sm">
                      {d3.timeFormat("%Y-%m-%d")(activity.date)}
                      {activity.type === "buy" ? (
                        <span className=" text-xs font-bold text-red-800">
                          (买)
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-green-800">
                          (卖)
                        </span>
                      )}
                    </p>
                    <p className="text-xs">{activity.fundName}</p>
                  </div>
                  <div className="text-xs pr-2 hover:text-blue-800 hover:cursor-pointer">
                    <a title={activity.fundName} href={activity.articleLink}>
                      查看
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </FullScreenWrapper>
      <ReferenceList references={activity_references} />
    </div>
  );
}

export default Activity;
