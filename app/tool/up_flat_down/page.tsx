"use client";

import React, { useEffect, useState, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import FullScreenWrapper from "@/app/components/FullScreenWrapper";
import StockStatsChart from "@/app/components/StockStatsChart";
import PercentageChart from "@/app/components/PercentageChart";
import { StockStat, PercentData } from "@/app/types";
import { transformData } from "@/app/utils/dataTransformer";
import { Database } from "@/lib/supabase";
import References from "@/app/components/Reference";
import { up_flat_down_references } from "@/app/utils/constant";
import ReferenceList from "@/app/components/ReferenceList";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function UpFlatDownCount() {
  const [stockStats, setStockStats] = useState<StockStat[]>([]);
  const [percentData, setPercentData] = useState<PercentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [stockStatsResponse, percentDataResponse] = await Promise.all([
          supabase.from("stock_stats").select("*"),
          supabase.from("percent").select("*"),
        ]);

        if (stockStatsResponse.error) throw stockStatsResponse.error;
        setStockStats(
          stockStatsResponse.data.sort((a, b) => a.date.localeCompare(b.date)),
        );

        if (percentDataResponse.error) throw percentDataResponse.error;
        setPercentData(percentDataResponse.data[0]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Ensure hooks are called unconditionally
  const transformedData = useMemo(
    () => transformData(stockStats),
    [stockStats],
  );
  const filteredMetadata = useMemo(() => {
    if (percentData) {
      return percentData.metadata.filter((d) => d.current_year_percent < 8000);
    }
    return [];
  }, [percentData]);

  if (loading)
    return (
      <p className="flex justify-center items-center min-h-screen">加载...</p>
    );
  if (stockStats.length === 0 || !percentData)
    return (
      <p className="flex justify-center items-center min-h-screen">
        No data available
      </p>
    );

  const latestStats = stockStats[stockStats.length - 1];

  return (
    <div className="container mx-auto p-2 md:p-4">
      <div className="grid grid-cols-1 gap-4">
        <FullScreenWrapper className="bg-gray-200 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2 text-center">涨跌统计</h2>
          <div className="bg-white rounded">
            <StockStatsChart
              data={transformedData}
              latestStats={{
                up: latestStats.up ?? 0,
                flat: latestStats.flat ?? 0,
                down: latestStats.down ?? 0,
              }}
            />
          </div>
        </FullScreenWrapper>

        <PercentageChart data={filteredMetadata} date={percentData.date} />
      </div>
      <ReferenceList references={up_flat_down_references} />
    </div>
  );
}
