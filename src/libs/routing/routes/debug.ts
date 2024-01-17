import { Route } from '@tanstack/react-router';
import { rootRoot } from 'libs/routing/routes/root';
import { DebugPage } from 'pages/debug';

export const debugPage = new Route({
  getParentRoute: () => rootRoot,
  path: '/debug',
  component: DebugPage,
});
