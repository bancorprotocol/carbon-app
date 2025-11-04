import 'global-shim';
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from 'reportWebVitals';
import { StoreProvider } from 'store';
import { WagmiReactWrapper } from 'libs/wagmi';
import { LazyMotion } from 'libs/motion';
import { QueryProvider } from 'libs/queries';
import { RouterProvider, router } from 'libs/routing';
import 'init-sentry';
import 'fonts.css';
import 'index.css';
import { SDKProvider } from 'libs/sdk/provider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <QueryProvider>
      <WagmiReactWrapper>
        <SDKProvider>
          <StoreProvider>
            <LazyMotion>
              <RouterProvider router={router} />
            </LazyMotion>
          </StoreProvider>
        </SDKProvider>
      </WagmiReactWrapper>
    </QueryProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
