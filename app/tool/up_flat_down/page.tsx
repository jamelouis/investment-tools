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
import { useIsMobile } from "@/hook/use-mobile";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "antd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BoxplotWithHistogramChart from "@/app/components/BoxplotWithHistogramChart";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function UpFlatDownCount() {
  const [stockStats, setStockStats] = useState<StockStat[]>([]);
  const [percentData, setPercentData] = useState<PercentData | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

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

  if (stockStats.length === 0 || !percentData)
    return (
      <p className="flex justify-center items-center min-h-screen">
        No data available
      </p>
    );

  const latestStats = stockStats[stockStats.length - 1];

  return (

    <div className="flex lg:items-center justify-center container lg:h-screen m-auto px-4 py-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">涨跌幅统计</CardTitle>
          <CardDescription className="text-center">涨跌幅曲线以及涨跌分位数({percentData.date})</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center m-4">
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            </div>
          ) : (
            <FullScreenWrapper isRotate={isMobile}>
              <Tabs defaultValue="up_flat_down" className="w-full">
                <TabsList>
                  <TabsTrigger value="up_flat_down">涨跌幅</TabsTrigger>
                  <TabsTrigger value="percentage_today">百分位(今天)</TabsTrigger>
                  <TabsTrigger value="percentage_YTD">百分位(年初至今)</TabsTrigger>
                </TabsList>
                <TabsContent value="up_flat_down">

                  <StockStatsChart
                    data={transformedData}
                    latestStats={{
                      up: latestStats.up ?? 0,
                      flat: latestStats.flat ?? 0,
                      down: latestStats.down ?? 0,
                    }}
                  />
                </TabsContent>
                <TabsContent value="percentage_today">
                  <BoxplotWithHistogramChart data={filteredMetadata} yField="percent" />
                </TabsContent>
                <TabsContent value="percentage_YTD">
                  <BoxplotWithHistogramChart data={filteredMetadata}
                    yField="current_year_percent" />
                </TabsContent>
              </Tabs>

            </FullScreenWrapper>
          )
          }
        </CardContent>
        <CardFooter>
          <ReferenceList references={up_flat_down_references} />
        </CardFooter>
      </Card>
    </div>
    /* 
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
  */
  );
}
