import { DisposalHistoricalChart } from "@/components/charts/disposal-historical/disposal-historical";
import { DisposalHistoricalChartBar } from "@/components/charts/disposal-historical/disposal-historical-bar";
import { DisposalHistoricalTable } from "@/components/charts/disposal-historical/disposal-historical-table";
import { transformDisposalLog } from "@/lib/utils";
import { fetchDisposeCount } from "@/services/disposeLog";

export default function DisposalContainer() {
  const { data: disposeCount } = fetchDisposeCount();
  const disposalCount = transformDisposalLog(disposeCount?.data || []);
  return (
    <div className="flex flex-col col-span-1 gap-4 sm:col-span-2 lg:col-span-6">
      <DisposalHistoricalTable data={disposalCount} />
      <DisposalHistoricalChart data={disposalCount} />
      <DisposalHistoricalChartBar data={disposalCount} />
    </div>
  );
}
