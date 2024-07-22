import { supabase } from "@/client/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentDisposal } from "@/services/disposeLog";
import { UseQueryResult, useQueryClient } from "@tanstack/react-query";
import { CircleDotDashed } from "lucide-react";
import { useEffect, useState } from "react";

interface DisposalItemProps {
  bin_type: string;
  created_at: string;
}

const DisposalItem = ({ bin_type, created_at }: DisposalItemProps) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex flex-row justify-center gap-2 item-center">
      <p className="font-medium leading-none text-md">{bin_type}</p>
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

export default function RecentDisposalComponent({
  limit = 5,
}: {
  limit?: number;
}) {
  const queryClient = useQueryClient();
  const { data, error, isLoading }: UseQueryResult<DisposalItemProps[], Error> =
    getRecentDisposal(limit);
  const [disposalData, setDisposalData] = useState<DisposalItemProps[]>([]);

  useEffect(() => {
    if (data) {
      setDisposalData(data);
    }
  }, [data]);

  useEffect(() => {
    const channel = supabase
      .channel("disposal_log")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "dispose_log",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["recentDisposal"] });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;

  return (
    <Card className="flex flex-col justify-start ">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle className="flex flex-row items-baseline justify-start gap-2">
          <CircleDotDashed size={22} />
          Recent Disposal
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        {disposalData.map((item, index) => (
          <DisposalItem
            key={index}
            bin_type={item.bin_type}
            created_at={item.created_at}
          />
        ))}
      </CardContent>
    </Card>
  );
}
