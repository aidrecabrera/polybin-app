import { createLazyFileRoute } from "@tanstack/react-router";

import BinLevelComponent from "@/components/charts/bin-level/bin-level-data";
import PredictionChart from "@/components/charts/prediction-log/prediction-log";
import WeeklyDisposalComponent from "@/components/charts/weekly-disposal/weekly-disposal-component";
import RecentAlertsComponent from "@/components/recent-alerts";

export function Charts() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 sm:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-4">
          <BinLevelComponent />
          <RecentAlertsComponent />
        </div>
        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-8">
          <PredictionChart />
          <WeeklyDisposalComponent />
        </div>
      </div>
    </div>
  );
}

export const Route = createLazyFileRoute("/")({
  component: () => (
    <>
      <Charts />
    </>
  ),
});
