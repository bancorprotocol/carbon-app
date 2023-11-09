import { Router } from '@tanstack/react-router';
import { routeTree } from 'libs/routing/routes';
import { parseSearchWith } from 'libs/routing/utils';

export const router = new Router<any, any>({
  routeTree,
  parseSearch: parseSearchWith(JSON.parse),
});
