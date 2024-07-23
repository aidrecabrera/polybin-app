## Overview

A dedicated web portal for [Project Polybin](https://github.com/aidrecabrera/polybin): an automated smart waste segregation system with machine learning and edge computing. This portal is a Progressive Web Application (PWA) that provides real-time monitoring of bin levels, disposal records, and inference performance. It also includes features such as confidence distribution visualization, alerts, and audio notifications for critical events.

### Key Features

- **Progressiveness**: Progressive Web Application (PWA) for cross-platform support and offline use.
- **Real-time Monitoring**: Continuous monitoring of bin levels, disposal records, and object detection predictions.
- **Bin Status**: Can view level percentages for each bin type and monitor fill levels.
- **Disposal Status**: Monitor the count of total waste disposals and average disposal rates for each type of waste.
- **Confidence Distribution**: Visualization of confidence scores for the past 100 predictions.
- **Performance Inference**: Based on the confidence distribution and prediction logs, monitor object detection performance.
- **Alerts**: Real-time notifications for select levels of targeting for the bins and certain bin-specific events.
- **Audio Alerts**: Audible notifications about critical events, making it easy to take action in time.

## Why?

To make the functioning of the Polybin project even better, it is further infused with some analytics, performance tracking, and monitoring features for actionable insights. This scale-up integrates a extended notification systems so that alert notifications can reach the users, especially the *janitors*, when the bins are full.

The PWA feature is crucial here because it allows wide accessibility and easy communication. Notifications could be sent either on a computer or on a smartphone (also through SMS and the actual device), with audio alerts in order to communicate an update that is both timely and unobtrusive.

The data acquired from the Polybin is processed and pushed to the Supabase backend is now ready for access by end-users in real time through the web portal for viewing and insights. This extension is meant to achieve efficiency in the Polybin's operation, valuable data for decision-making regarding waste management, and timely intervention.

> [!NOTE]
> The application is not designed for real-time control of the system, but rather for monitoring and analysis.

### Offline Mode Access

To ensure the application functions offline, users need to see the last known state of the system and access key features without an active internet connection. This allows users to keep track of the system even when they are offline.

<details>
 <summary>VitePWA Configuration Snippet</summary>
 
```javascript
export default defineConfig({
  plugins: [
    viteReact(),
    VitePWA({
      injectRegister: "auto", // Inject a register script for the service worker
      registerType: "autoUpdate", // Automatically update service worker
      manifest: {
        // PWA manifest can be found in the repo.
      },
      workbox: {
        // Workbox configuration can be found in the repo.
      },
    }),
  ],
});
```
</details>

The VitePWA plugin simplifies offline access, caching, and progressiveness for the app. It automatically serves a service worker with options like `injectRegister: 'auto'` and `registerType: "autoUpdate"`, enabling offline functionality through asset caching.

The `runtimeCaching` configuration uses `workbox` handlers, such as `NetworkFirst`, to prioritize fresh data when online and fallback to cached data offline. While the `globPatterns` ensure that all critical file types are cached.

> [!TIP]
> Caching all the necessary assets is bad practice, as it can lead to bloated caches and slow performance. It is important to cache only the essential assets for offline access. I adopted the Rapid App Development (RAD) approach to ensure the application is developed quickly and efficiently (jk i was just lazy).

The `manifest` option includes essential information like theme color, icons, and display mode, making the app installable and providing a native-like experience.

### Real-Time Monitoring

The real-time monitoring and notification capabilities was possible through [Supabase Realtime](https://github.com/supabase/realtime). This ensures users are always informed about the system's performance and receive alerts instantly when events occur.

### Data Visualization

The data visualization features was possible using [Recharts](https://recharts.org/), which by integrating the recent chart components done by [shadcn/ui](https://ui.shadcn.com/docs/components/chart), enables the user to understand data and get insights from the information. The way the setup is done in this application facilitates the reusability of the chart component for different data sets.

<details>
  <summary>Realtime Monitoring Code Snippet</summary>

```javascript
useEffect(() => {
  const setupNotifications = async () => {
    try {
      await requestNotificationPermission();
    } catch (error) {
      console.error("Notification permission error:", error);
    }
  };

  setupNotifications();

  if (session?.session) {
    channelRef.current = supabase
      .channel("alert_log")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "alert_log" },
        async (payload) => {
          const binType = binTypeMap[payload.new.bin_type] || "Unknown";
          const createdAt = new Date(payload.new.created_at).toLocaleString();
          toast.error(`Alert: The ${binType} bin is full as of ${createdAt}`, {
            cancel: {
              label: "View Bin Status",
              onClick: () => navigate({ to: "/bin" }),
            },
          });

          audioQueue.push(audioMap[payload.new.bin_type]);
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
  }

  return () => {
    channelRef.current?.unsubscribe();
    channelRef.current = null;
    audioQueue = [];
  };
}, [queryClient, navigate, session]);
```

</details>

## Data Schema

````sql
CREATE TABLE IF NOT EXISTS public.alert_log (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    text TEXT
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.bin_levels (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "SENSOR_1" DOUBLE PRECISION NOT NULL,
    "SENSOR_2" DOUBLE PRECISION NOT NULL,
    "SENSOR_3" DOUBLE PRECISION NOT NULL,
    "SENSOR_4" DOUBLE PRECISION NOT NULL
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.dispose_log (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    bin_type TEXT NOT NULL
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.prediction_log (
    prediction_id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    x DOUBLE PRECISION NOT NULL,
    y DOUBLE PRECISION NOT NULL,
    width DOUBLE PRECISION NOT NULL,
    height DOUBLE PRECISION NOT NULL,
    confidence DECIMAL NOT NULL,
    class TEXT NOT NULL,
    class_id INT NOT NULL,
    id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc')
) TABLESPACE pg_default;
````

### Key Technologies

- **React**: Building the user interface
- **Vite**: Fast and efficient development
- **TailwindCSS**: Styling the UI
- **Supabase JavaScript Library**: Supabase backend integration
- **Tanstack Query**: Data fetching, caching, and synchronization
- **react-hook-form**: Form management and validation
- **zod**: Schema validation for form data
- **Tanstack Router**: Routing and navigation
- **VitePWA**: Progressive Web Application features
- **shadcn**: Chart components
- **Recharts**: Data visualization