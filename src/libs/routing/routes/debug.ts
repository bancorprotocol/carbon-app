import { createRoute } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import { DebugPage } from 'pages/debug';

export const debugPage = createRoute({
  getParentRoute: () => rootRoute,
  path: '/debug',
  component: DebugPage,
});
