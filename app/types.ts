export interface Tool {
  id: string;
  name: string;
  description: string;
  image?: string;
  category: string[];
}

export interface StockStat {
  date: string;
  up: number | null;
  flat: number | null;
  down: number | null;
}

export interface PercentData {
  date: string;
  metadata: {
    percent: number;
    current_year_percent: number;
  }[];
}

export interface TransformedData {
  date: string;
  value: number | null;
  name: "up" | "flat" | "down";
}
