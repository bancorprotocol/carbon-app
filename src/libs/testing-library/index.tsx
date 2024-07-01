import { ReactNode, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { WagmiReactWrapper } from 'libs/wagmi';
import { StoreProvider } from 'store';
import { QueryProvider } from 'libs/queries';
import { loadRouter } from './utils';
import { RouterProvider } from '@tanstack/react-router';
import { RouterRenderParams } from './types';

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return (
    <QueryProvider>
      <StoreProvider>
        <WagmiReactWrapper>{children}</WagmiReactWrapper>
      </StoreProvider>
    </QueryProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) =>
  render(ui, {
    wrapper: AllTheProviders,
    ...options,
  });

export const renderWithRouter = async (params: RouterRenderParams) => {
  const customRouter = await loadRouter(params);
  return {
    container: customRender(<RouterProvider router={customRouter} />),
    router: customRouter,
  };
};

export * from '@testing-library/react';
export { customRender as render };
