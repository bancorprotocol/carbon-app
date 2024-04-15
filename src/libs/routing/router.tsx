import { Router } from '@tanstack/react-router';
import { routeTree } from 'libs/routing/routes';
import { parseSearchWith } from 'libs/routing/utils';

export const router = new Router({
  routeTree,
  parseSearch: parseSearchWith(JSON.parse),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
