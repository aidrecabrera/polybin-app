import { AlertHistoricalChart } from "@/components/charts/alert-historical/alert-historical-chart";
import { AlertHistoricalTable } from "@/components/charts/alert-historical/alert-historical-table";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/alerts")({
  component: () => (
    <div>
      <div className="py-4 space-y-4">
        <AlertHistoricalChart />
        <AlertHistoricalTable />
      </div>
    </div>
  ),
});
