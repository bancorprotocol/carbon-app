import { Router } from '@tanstack/react-router';
import { routeTree } from 'libs/routing/routes';

export const router = new Router({
  routeTree,
  parseSearch: (searchStr) => {
    const searchParams = new URLSearchParams(searchStr);
    let query: Record<string, unknown> = {};
    for (const [key, value] of searchParams.entries()) {
      switch (value) {
        case '':
          break;
        case 'undefined':
          break;
        case 'null':
          query[key] = null;
          break;
        case 'true':
          query[key] = true;
          break;
        case 'false':
          query[key] = false;
          break;
        default:
          query[key] = value;
      }
    }
    return query;
  },
  stringifySearch: (search) => {
    const searchParams = new URLSearchParams();
    for (const key in search) {
      const value = search[key];
      if (value !== '') searchParams.set(key, search[key]);
    }
    const searchStr = searchParams.toString();
    return searchStr ? `?${searchStr}` : '';
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
