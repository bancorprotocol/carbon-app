import { ReactNode, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { WagmiReactWrapper } from 'libs/wagmi';
import { StoreProvider } from 'store';
import { QueryProvider } from 'libs/queries';
import { loadRouter, type RouterRenderParams } from './utils';
import { RouterProvider } from '@tanstack/react-router';

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return (
    <QueryProvider>
      <StoreProvider>
        <WagmiReactWrapper>{children}</WagmiReactWrapper>
      </StoreProvider>
    </QueryProvider>
  );
};

/**
 * Custom render function that wraps the component with predefined providers.
 * This function is an extension of the `render` method from `@testing-library/react`.
 * All the render options are provided for `wrapper`, which is predefined in this function.
 *
 * @param {ReactElement} ui The React element to render.
 * @param {Omit<RenderOptions, 'wrapper'>} [options] Optional rendering options, excluding `wrapper`.
 * @returns {RenderResult} The result of rendering the given React element.
 *
 * @example
 * renderWithProviders(<MyComponent />);
 */
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) =>
  render(ui, {
    wrapper: AllTheProviders,
    ...options,
  });

/**
 * Asynchronously renders a component within a custom router and returns the rendered container and router instance.
 *
 * This function leverages `loadRouter` to asynchronously create and load a custom router based on the specified parameters.
 * It then renders the component within this router using a `RouterProvider`. The function returns an object containing
 * the rendered container and the custom router instance, allowing for further interaction or testing.
 *
 * @param params - The parameters for creating and loading the custom router.
 * @param params.component - A function that returns the component to be rendered by the router.
 * @param params.basePath - The base path for the router. Defaults to '/'.
 * @param params.search - The optional search parameters to be included in the route. Object keys and values are encoded into a query string.
 
 * @returns {Promise<{container: RenderResult, router: Router}>} A promise that resolves to an object containing the `container` with the rendered output and the `router` instance.
 * 
 * @example
 * // Render page
 * const { router } = await renderWithRouter({
 *   component: () => <CreateOverlappingStrategyPage />,
 *   basePath: '/strategies/create/overlapping',
 *   search: {
 *     base: 'ETH',
 *     quote: 'USDC',
 *   },
 * });
 */
export const renderWithRouter = async (params: RouterRenderParams) => {
  const customRouter = await loadRouter(params);
  return {
    container: renderWithProviders(
      <RouterProvider router={customRouter as any} />,
    ),
    router: customRouter,
  };
};

export * from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';
export * from './utils';
export * from './drivers';
