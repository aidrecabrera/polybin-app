import { Card } from "@/components/ui/card";
import { mapDailySensorData } from "@/lib/utils";
import { getTodayBinLevel } from "@/services/binLevel";
import { BinDailyChart } from "./bin-daily-data";

function BinDailyComponent() {
  const { data, isLoading } = getTodayBinLevel();
  const sensorData = data
    ? ["SENSOR_1", "SENSOR_2", "SENSOR_3", "SENSOR_4"].map(
        (sensor) => mapDailySensorData(data, sensor)
      )
    : [];

  const sensorHeaders = [
    "Biodegradable",
    "Non-biodegradable",
    "Recyclable",
    "Hazardous",
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <div className="w-full h-full rounded-lg shadow animate-pulse">
              <div className="px-6 py-4 border-b">
                <div className="w-1/3 h-4 mb-2 rounded bg-gray-200/25"></div>
              </div>
              <div className="px-6 py-4">
                <div className="h-64 rounded bg-gray-200/25"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
      {sensorData.map((data, index) => (
        <Card key={index}>
          <BinDailyChart data={data} header={sensorHeaders[index]} />
        </Card>
      ))}
    </div>
  );
}

export default BinDailyComponent;
