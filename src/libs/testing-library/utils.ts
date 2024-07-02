import {
  encode,
  RootRoute,
  Route,
  Router,
  createMemoryHistory,
} from '@tanstack/react-router';
import { RouterRenderParams } from './types';
import { debugTokens } from '../../../e2e/utils/types';

export const tokens = [
  {
    address: debugTokens.ETH,
    decimals: 18,
    symbol: 'ETH',
  },
  {
    address: debugTokens.USDC,
    decimals: 6,
    symbol: 'USDC',
  },
];

export const loadRouter = async ({
  component,
  basePath = '/',
  search = {},
}: RouterRenderParams) => {
  const rootRoute = new RootRoute();
  const subPath = encode(search);
  const path = `${basePath}?${subPath}`;

  const recurringRoute = new Route({
    getParentRoute: () => rootRoute,
    path: basePath,
    component,
  });

  const customRouter = new Router({
    routeTree: rootRoute.addChildren([recurringRoute]),
    history: createMemoryHistory({ initialEntries: [path] }),
  });

  await customRouter.load();

  return customRouter;
};
