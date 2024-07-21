import { BinHistoricalComponent } from "@/components/charts/bin-historical/bin-historical-component";
import BinDailyComponent from "@/components/charts/daily/bin-daily-chart";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/bin")({
  component: () => (
    <div className="flex flex-col gap-4">
      <BinHistoricalComponent />
      <BinDailyComponent />
    </div>
  ),
});
