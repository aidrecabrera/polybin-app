import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

export type PredictionLog = {
  prediction_id: number
  x: number
  y: number
  width: number
  height: number
  confidence: number
  class: string
  class_id: number
  detection_id: string
  created_at: string
}

export const columns: ColumnDef<PredictionLog>[] = [
  {
    accessorKey: "prediction_id",
    header: "ID",
  },
  {
    accessorKey: "x",
    header: "X",
  },
  {
    accessorKey: "y",
    header: "Y",
  },
  {
    accessorKey: "width",
    header: "Width",
  },
  {
    accessorKey: "height",
    header: "Height",
  },
  {
    accessorKey: "confidence",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Confidence
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const confidence = parseFloat(row.getValue("confidence"))
      return <div>{confidence.toFixed(2)}</div>
    },
  },
  {
    accessorKey: "class",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Class
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
  },
  {
    accessorKey: "class_id",
    header: "Class ID",
  },
  {
    accessorKey: "detection_id",
    header: "Detection ID",
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created At
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at")).toLocaleString()
      return <div>{date}</div>
    },
  },
]