import { supabase } from "@/client/supabaseClient";
import { LoginForm } from "@/components/login";
import { ModeToggle } from "@/components/theme/theme-toggle";
import { Layout } from "@/layout/layout";
import { isAuthenticated } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";

const binTypeMap: { [key: string]: string } = {
  non: "Non-Biodegradable",
  bio: "Biodegradable",
  haz: "Hazardous",
  rec: "Recyclable",
};

const audioMap: { [key: string]: string } = {
  non: "/alerts/non_biodegradable.mp3",
  bio: "/alerts/biodegradable.mp3",
  haz: "/alerts/hazardous.mp3",
  rec: "/alerts/recyclable.mp3",
  empty: "/alerts/please_empty.mp3",
};

let audioQueue: string[] = [];
let isPlaying = false;

const playAudio = (audioPath: string): Promise<void> => {
  return new Promise<void>((resolve) => {
    const audio = new Audio(audioPath);
    audio.onended = () => resolve();
    audio.onerror = (e) => {
      console.error("Audio play error:", e);
      resolve();
    };
    audio.play().catch((e) => {
      console.error("Audio play error:", e);
      resolve();
    });
  });
};

const processAudioQueue = async (): Promise<void> => {
  if (isPlaying || audioQueue.length === 0) return;

  isPlaying = true;
  const audioPath = audioQueue.shift();
  if (audioPath) {
    try {
      await playAudio(audioPath);
      if (audioPath !== audioMap["empty"]) {
        await playAudio(audioMap["empty"]);
      }
    } catch (error) {
      console.error("Audio play error:", error);
    }
  }
  isPlaying = false;
  processAudioQueue();
};

const requestNotificationPermission = async (): Promise<void> => {
  if ("Notification" in window && navigator.serviceWorker) {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Permission not granted for Notification");
    }
  }
};

const sendNotification = async (
  title: string,
  options: NotificationOptions
): Promise<void> => {
  if (navigator.serviceWorker) {
    const registration = await navigator.serviceWorker.ready;
    registration.showNotification(title, options);
  }
};

export const Route = createRootRoute({
  component: () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
      const setupNotifications = async (): Promise<void> => {
        try {
          await requestNotificationPermission();
        } catch (error) {
          console.error("Notification permission error:", error);
        }
      };

      setupNotifications();

      const channel = supabase
        .channel("alert_log")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "alert_log",
          },
          async (payload) => {
            console.log("Channel payload", payload);
            const binType =
              binTypeMap[(payload.new as { bin_type: string }).bin_type] ||
              "Unknown";
            const createdAt = new Date(
              (payload.new as { created_at: string }).created_at
            ).toLocaleString();
            toast.error(
              `Alert: The ${binType} bin is full as of ${createdAt}`,
              {
                cancel: {
                  label: "View Bin Status",
                  onClick: () => {
                    navigate({ to: "/bin" });
                  },
                },
              }
            );

            audioQueue.push(
              audioMap[(payload.new as { bin_type: string }).bin_type]
            );
            processAudioQueue();

            try {
              await sendNotification(`Alert: The ${binType} bin is full`, {
                body: `As of ${createdAt}`,
                icon: "icon-192x192.png",
              });
            } catch (error) {
              console.error("Notification error:", error);
            }
            queryClient.invalidateQueries({ queryKey: ["recentAlerts"] });
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
        audioQueue = [];
      };
    }, [queryClient, navigate]);
    const { data: session, isLoading } = isAuthenticated();

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!session?.session) {
      return (
        <div className="flex items-center justify-center h-screen">
          <LoginForm />
        </div>
      );
    }
    return (
      <>
        <div className="fixed top-0 right-0 z-50 p-4">
          <ModeToggle />
        </div>
        <Layout>
          <Outlet />
        </Layout>
      </>
    );
  },
});
