import { mapDailySensorData } from "@/lib/utils";
import { getTodayBinLevel } from "@/services/binLevel";
import { BinDailyChart } from "./bin-daily-data";

function BinDailyComponent() {
  const { data } = getTodayBinLevel();
  if (!data) return null;
  const sensorData = ["SENSOR_1", "SENSOR_2", "SENSOR_3", "SENSOR_4"].map(
    (sensor) => mapDailySensorData(data, sensor)
  );
  const sensorHeaders = [
    "Biodegradable",
    "Non-biodegradable",
    "Recyclable",
    "Hazardous",
  ];
  return (
    <div className="flex flex-col items-center justify-center w-full space-y-4">
      {sensorData.map((data, index) => (
        <BinDailyChart key={index} data={data} header={sensorHeaders[index]} />
      ))}
    </div>
  );
}

export default BinDailyComponent;
