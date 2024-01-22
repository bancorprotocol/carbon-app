import { Route } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import { DebugPage } from 'pages/debug';

export const debugPage = new Route({
  getParentRoute: () => rootRoute,
  path: '/debug',
  component: DebugPage,
});
