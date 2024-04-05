import { Router } from '@tanstack/react-router';
import { routeTree } from 'libs/routing/routes';

export const router = new Router({
  routeTree,
  parseSearch: (searchStr) => {
    const searchParams = new URLSearchParams(searchStr);
    return Object.fromEntries(searchParams.entries());
  },
  stringifySearch: (search) => {
    const searchParams = new URLSearchParams();
    for (const key in search) searchParams.set(key, search[key]);
    const searchStr = searchParams.toString();
    return searchStr ? `?${searchStr}` : '';
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
