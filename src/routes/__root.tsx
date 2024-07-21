import { ModeToggle } from "@/components/theme/theme-toggle";
import { Layout } from "@/layout/layout";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="fixed top-0 right-0 z-50 p-4">
        <ModeToggle />
      </div>
      <Layout>
        <Outlet />
      </Layout>
      <TanStackRouterDevtools />
    </>
  ),
});
