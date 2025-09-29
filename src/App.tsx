import * as React from 'react'
import { 
  createRouter, 
  RouterProvider, 
  createRootRoute, 
  createRoute as createTanStackRoute, 
  Outlet 
} from '@tanstack/react-router'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GameProvider } from '@/contexts/GameContext';
import Home from "./pages/Home";
import Leaderboards from "./pages/Leaderboards";
import Achievements from "./pages/Achievements";
import Upgrades from "./pages/Upgrades";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Create root route
const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GameProvider>
          <Toaster />
          <Sonner />
          <Outlet />
        </GameProvider>
      </TooltipProvider>
    </QueryClientProvider>
  ),
})

// Create routes
const homeRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const leaderboardsRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: '/leaderboards',
  component: Leaderboards,
});

const achievementsRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: '/achievements',
  component: Achievements,
});

const upgradesRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: '/upgrades',
  component: Upgrades,
});

const notFoundRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFound,
});

// Create route tree
const routeTree = rootRoute.addChildren([homeRoute, leaderboardsRoute, achievementsRoute, upgradesRoute, notFoundRoute])

// Create router
const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent' as const,
  defaultPreloadStaleTime: 0,
})

// Register for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const App = () => <RouterProvider router={router} />

export default App;