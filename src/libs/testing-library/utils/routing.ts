import {
  RootRoute,
  Route,
  Router,
  createMemoryHistory,
} from '@tanstack/react-router';
import { RouterRenderParams } from './types';
import { parseSearchWith } from 'libs/routing/utils';
import { isAddress } from 'ethers/lib/utils';

const encodeValue = (value: string | number | symbol) => {
  if (typeof value == 'string' && isAddress(value)) return `${String(value)}`;
  if (!isNaN(Number(value))) return `"${String(value)}"`;
  return `${String(value)}`;
};

const encodeParams = (
  searchParams: Record<string, string | number | symbol>
): string => {
  return Object.entries(searchParams)
    .map(([key, value]) => `${key}=${encodeValue(value)}`)
    .join('&');
};

/**
 * Asynchronously created and loads a custom router with the specified component and optional base path and search parameters.
 *
 * This function initializes a custom router with a single route based on the provided parameters.
 * It creates a memory history for the router with an initial path constructed from the basePath and
 * encoded search parameters.
 *
 * @param component - A function that returns the component to be rendered by the router.
 * @param basePath - The base path for the router. Defaults to '/'.
 * @param search - The optional search parameters to be included in the route. Object keys and values are encoded into a query string.
 * @returns A promise that resolves to the initialized and loaded router.
 */
export const loadRouter = async ({
  component,
  basePath = '/',
  search = {},
}: RouterRenderParams) => {
  const rootRoute = new RootRoute();
  const subPath = encodeParams(search);
  const path = `${basePath}?${subPath}`;

  const componentRoute = new Route({
    getParentRoute: () => rootRoute,
    path: basePath,
    component,
  });

  const customRouter = new Router({
    routeTree: rootRoute.addChildren([componentRoute]),
    parseSearch: parseSearchWith(JSON.parse),
    history: createMemoryHistory({ initialEntries: [path] }),
  });

  await customRouter.load();

  return customRouter;
};
