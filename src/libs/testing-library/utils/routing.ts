import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';
import { RouterRenderParams } from './types';
import { isAddress } from 'ethers/lib/utils';

const encodeValue = (value: string | number | symbol) => {
  if (typeof value == 'string' && isAddress(value)) return value;
  if (!isNaN(Number(value))) return `"${String(value)}"`;
  return `${String(value)}`;
};

const encodeParams = (
  searchParams: Record<string, string | number | symbol>,
): string => {
  return Object.entries(searchParams)
    .map(([key, value]) => `${key}=${encodeValue(value)}`)
    .join('&');
};

const replaceParams = (url: string, params: Record<string, string>) => {
  if (!Object.keys(params).length) return url;
  const pattern = Object.keys(params)
    .map((key) => `\\$${key}`)
    .join('|');
  const regex = new RegExp(pattern, 'g');
  return url.replace(regex, (match) => params[match.replace('$', '')]);
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
  params = {},
}: RouterRenderParams) => {
  const rootRoute = createRootRoute();
  const subPath = encodeParams(search);
  const path = `${replaceParams(basePath, params)}?${subPath}`;

  const routes: ReturnType<typeof createRoute>[] = [];
  const paths = basePath.split('/');
  for (let i = 0; i < paths.length; i++) {
    const currentPath = paths[i] || '/';
    const parent = routes.at(-1) ?? rootRoute;
    const route: ReturnType<typeof createRoute> = createRoute({
      getParentRoute: () => parent,
      path: currentPath,
      component: i === paths.length - 1 ? component : Outlet,
    });
    parent.addChildren([route]);
    routes.push(route);
  }

  const customRouter = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: [path] }),
  });

  await customRouter.load();

  return customRouter;
};
