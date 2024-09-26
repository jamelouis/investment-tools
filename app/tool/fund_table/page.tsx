"use client";
import AssetLists from "@/app/components/AssetList";
import { useCSVData, base_path } from "@/app/utils/constant";

export default function FundTable() {
  const { data: assetsData, error: assetsError } = useCSVData(
    base_path + "/csv/assets.csv",
    // Asset_CSV_URL,
    (d) => d,
  );

  return (
    <div className="py-6 px-4 max-w-7xl m-auto">
      <h2 className="text-2xl font-bold mb-4">ETF150 基金表</h2>
      {assetsData && <AssetLists data={assetsData} />}
    </div>
  );
}
