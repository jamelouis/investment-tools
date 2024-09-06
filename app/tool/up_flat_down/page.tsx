"use client";

import FullScreenWrapper from "@/app/components/FullScreenWrapper";

import ErrorBoundary from "@/app/components/ErrorBoundary";

import { createClient } from "@supabase/supabase-js";
import { Database } from "../../../lib/supabase";
import { useEffect, useState } from "react";
import MarketSentimentChart from "../../components/StackedBar";
import { DualAxes, Line } from "@ant-design/plots";
import BoxplotWithHistogramChart from "@/app/components/BoxplotWithHistogramChart";
import { StockStat, PercentData, TransformedData } from "@/app/types";
import References from "@/app/components/Reference";

const supabase = createClient<Database>(
  "https://ortnrxgwpiizulknfdgr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ydG5yeGd3cGlpenVsa25mZGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM2ODc2MDcsImV4cCI6MjAzOTI2MzYwN30.zbPUOJkwzyPpB5QJEaGpr13Ro3u_3S86cdLnpxPNFV4",
);

function transformData(data: StockStat[]): TransformedData[] {
  return data.flatMap((item) => [
    { date: item.date, value: item.up, name: "up" },
    { date: item.date, value: item.flat, name: "flat" },
    { date: item.date, value: item.down, name: "down" },
    {
      date: item.date,
      value: (item.up ?? 0) + (item.flat ?? 0) + (item.down ?? 0),
      name: "total",
    },
  ]);
}

export default function UpFlatDownCount() {
  const [stockStats, setStockStats] = useState<StockStat[]>([
    { date: "2024-08-13", up: 3729, flat: 231, down: 1377 },
  ]);
  const [percentData, setPercentData] = useState<PercentData | null>(null);

  useEffect(() => {
    const fetchStockStats = async () => {
      const { data, error } = await supabase
        .from("stock_stats")
        .select("*")
        .returns<StockStat[]>();
      if (error) console.log("error", error);
      else setStockStats(data.sort((a, b) => a.date.localeCompare(b.date)));
    };

    const fetchPercentData = async () => {
      const { data, error } = await supabase
        .from("percent")
        .select("*")
        .returns<PercentData[]>();
      if (error) console.log(error);
      else setPercentData(data[0]);
    };

    fetchStockStats();
    fetchPercentData();
  }, []);

  if (stockStats.length === 0 || !percentData)
    return (
      <p className="flex justify-center items-center min-h-screen">加载...</p>
    );

  const { up, flat, down } = stockStats[stockStats.length - 1];
  const transformedData = transformData(stockStats);

  const config = {
    data: transformedData,
    xField: "date",
    yField: "value",
    colorField: "name",
    legend: { position: "top" },
    smooth: true,
    // Remove custom color function for now
    scale: {
      y: { nice: true },
      color: {
        domain: ["up", "flat", "down", "total"],
        range: ["#F44336", "#5f5f5f", "#4CAF50", "#000000"],
      },
    },
  };

  const metadata = percentData.metadata.filter(
    (d) => d.current_year_percent < 8000,
  );

  const referenceData = [
    { title: "title01", url: "http://www.baidu.com" },
    { title: "title02", url: "http://www.google.com" },
  ];

  return (
    <div className="container mx-auto p-2 md:p-4">
      <div className="grid grid-cols-1 gap-4">
        <FullScreenWrapper className="bg-gray-200 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2 text-center">涨跌统计</h2>
          <div className="bg-white rounded">
            <div className="flex justify-center">
              <MarketSentimentChart
                up={up ?? 0}
                flat={flat ?? 0}
                down={down ?? 0}
              />
            </div>
            <Line {...config} />
          </div>
        </FullScreenWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FullScreenWrapper className="bg-gray-200 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">
              {percentData.date}日涨跌幅
            </h2>
            <div className="bg-white rounded">
              <BoxplotWithHistogramChart data={metadata} yField="percent" />
            </div>
          </FullScreenWrapper>
          <FullScreenWrapper className="bg-gray-200 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">
              年初至{percentData.date}涨跌幅
            </h2>
            <div className="bg-white rounded">
              <BoxplotWithHistogramChart
                data={metadata}
                yField="current_year_percent"
              />
            </div>
          </FullScreenWrapper>
        </div>
      </div>
    </div>
  );
}
