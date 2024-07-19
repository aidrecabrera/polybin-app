import { getWeeklyBinLevel } from "@/services/binLevel";
import { BinWeeklyChart } from "./bin-weekly-data";

function BinWeeklyComponent() {
  const { data } = getWeeklyBinLevel();

  if (data) {
    return (
      <div>
        <BinWeeklyChart chartData={data} />
      </div>
    )
  }

  return (
    <div>
        <BinWeeklyChart chartData={[]} />
    </div>
  )
}

export default BinWeeklyComponent