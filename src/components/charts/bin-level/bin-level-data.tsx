import { getLatestBinLevel } from '@/services/binLevel';
import { BinLevelChart } from './bin-level-chart';

function BinLevelComponent() {
  const { data } = getLatestBinLevel();

  if (!data) return <div>Loading...</div>;

  const chartData = [
    { sensor: 'Sensor 1', level: data.SENSOR_1 },
    { sensor: 'Sensor 2', level: data.SENSOR_2 },
    { sensor: 'Sensor 3', level: data.SENSOR_3 },
    { sensor: 'Sensor 4', level: data.SENSOR_4 },
  ];

  return (
    <div>
      <BinLevelChart chartData={chartData} />
    </div>
  );
}

export default BinLevelComponent;
