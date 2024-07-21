import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

export type DisposeLog = {
  id: number
  created_at: string
  bin_type: string
}

export const columns: ColumnDef<DisposeLog>[] = [
  {
    accessorKey: "id",
    header: "ID",
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
  {
    accessorKey: "bin_type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Bin Type
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
  },
]