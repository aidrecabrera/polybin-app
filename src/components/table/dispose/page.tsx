import { fetchDisposeLogFromSupabase } from "@/services/disposeLog";
import { useEffect, useState } from "react";
import { DisposeLog, columns } from "./columns";
import { DataTable } from "./data-table";

export default function DisposalLogsTable() {
  const [data, setData] = useState<DisposeLog[]>([]);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const fetchData = async (page: number, pageSize: number) => {
    const { data, count } = await fetchDisposeLogFromSupabase(
      page,
      pageSize,
      startDate,
      endDate
    );
    setData(data || []);
    setTotal(count || 0);
    setPageCount(Math.ceil((count || 0) / pageSize));
  };

  useEffect(() => {
    fetchData(0, 10);
  }, [startDate, endDate]);

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        total={total}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        pageCount={pageCount}
        fetchData={fetchData}
      />
    </div>
  );
}
