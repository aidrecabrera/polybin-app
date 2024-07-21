import PredictionLogPieChart from "@/components/charts/prediction-chart/prediction-allocation";
import PredictionLogChart from "@/components/charts/prediction-chart/prediction-chart";
import PredictionLogsTable from "@/components/table/prediction/page";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/prediction")({
  component: () => (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <PredictionLogPieChart />
          <PredictionLogChart />
      </div>
      <div className="hidden md:block">
      <PredictionLogsTable />
      </div>
    </div>
  ),
});
