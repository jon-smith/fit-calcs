import {
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';

import {
  App,
  CalculatorIndexPage,
  NRepMaxPage,
  NotFoundPage,
  RunningPacePage,
} from './App';

const rootRoute = createRootRoute({
  component: App,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CalculatorIndexPage,
});

const runningPaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/running-pace',
  component: RunningPacePage,
});

const nRepMaxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/n-rep-max',
  component: NRepMaxPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  runningPaceRoute,
  nRepMaxRoute,
]);

export const router = createRouter({
  routeTree,
  history: createHashHistory(),
  defaultNotFoundComponent: NotFoundPage,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
