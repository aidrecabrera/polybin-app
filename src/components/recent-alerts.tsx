import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentAlerts } from "@/services/alertLog";
import { AlertTriangleIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface AlertItemProps {
  bin_type: string | null;
  created_at: string;
}

const binTypeMap: { [key: string]: string } = {
  non: "Non-Biodegradable",
  bio: "Biodegradable",
  haz: "Hazardous",
  rec: "Recyclable",
};

const AlertItem = ({ bin_type, created_at }: AlertItemProps) => {
  const binTypeFull = bin_type ? binTypeMap[bin_type] : bin_type;
  return (
    <div className="flex items-center justify-between gap-4 py-2 rounded-sm ">
      <div className="flex flex-row justify-center gap-2 item-center">
        <p className="font-medium leading-none text-md">{binTypeFull}</p>
      </div>
      <p className="text-sm text-muted-foreground">
        {new Date(created_at).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        })}
      </p>
    </div>
  );
};

export default function RecentAlertsComponent({
  limit = 5,
}: {
  limit?: number;
}) {
  const { data, error, isLoading } = getRecentAlerts(limit);
  const [alertData, setAlertData] = useState<AlertItemProps[]>([]);

  useEffect(() => {
    if (data) {
      setAlertData(data);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;

  return (
    <Card className="flex flex-col justify-start">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle className="flex flex-row items-baseline justify-start gap-2">
          <AlertTriangleIcon size={22} />
          <p>Alerts</p>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-1">
        {alertData.map((item, index) => (
          <AlertItem
            key={index}
            bin_type={item.bin_type}
            created_at={item.created_at}
          />
        ))}
      </CardContent>
    </Card>
  );
}
