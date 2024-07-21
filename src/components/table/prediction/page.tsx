import { fetchPredictionLogFromSupabase } from "@/services/predictionLog"
import { useEffect, useState } from "react"
import { columns, PredictionLog } from "./column"
import { DataTable } from "./data-table"

export default function PredictionLogsTable() {
  const [data, setData] = useState<PredictionLog[]>([])
  const [total, setTotal] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const fetchData = async (page: number, pageSize: number) => {
    const { data, count } = await fetchPredictionLogFromSupabase(
      page,
      pageSize,
      startDate,
      endDate
    )
    setData(data || [])
    setTotal(count || 0)
    setPageCount(Math.ceil((count || 0) / pageSize))
  }

  useEffect(() => {
    fetchData(0, 10)
  }, [startDate, endDate])

  return (
      <DataTable
        columns={columns}
        data={data}
        total={total}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        pageCount={pageCount}
        fetchData={fetchData}
      />
  )
}