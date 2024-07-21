import RecentDisposalComponent from "@/components/recent-disposal";
import DisposalLogsTable from "@/components/table/dispose/page";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dispose")({
  component: () => {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <div className="col-span-1 sm:col-span-2 lg:col-span-4">
          <DisposalLogsTable />
        </div>
        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
          <RecentDisposalComponent />
        </div>
      </div>
    );
  },
});
