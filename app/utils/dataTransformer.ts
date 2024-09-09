// utils/dataTransformers.ts
import { StockStat, TransformedData } from "@/app/types";

export function transformData(data: StockStat[]): TransformedData[] {
  return data.flatMap((item) => [
    { date: item.date, value: item.up ?? 0, name: "up" },
    { date: item.date, value: item.flat ?? 0, name: "flat" },
    { date: item.date, value: item.down ?? 0, name: "down" },
    {
      date: item.date,
      value: (item.up ?? 0) + (item.flat ?? 0) + (item.down ?? 0),
      name: "total",
    },
  ]);
}
