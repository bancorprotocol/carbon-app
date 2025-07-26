import 'global-shim';
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from 'reportWebVitals';
import { StoreProvider } from 'store';
import { WagmiReactWrapper } from 'libs/wagmi';
import { LazyMotion } from 'libs/motion';
import { QueryProvider } from 'libs/queries';
import { RouterProvider, router } from 'libs/routing';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import config from 'config';
import 'init-sentry';
import 'fonts.css';
import 'index.css';
import 'init-config';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const WalletProvider =
  config.network.name === 'TON' ? TonConnectUIProvider : WagmiReactWrapper;

root.render(
  <React.StrictMode>
    <QueryProvider>
      <StoreProvider>
        <WalletProvider
          manifestUrl={
            config.network.name === 'TON'
              ? `${config.appUrl}/tonconnect-manifest.json`
              : undefined
          }
        >
          <LazyMotion>
            <RouterProvider router={router} />
          </LazyMotion>
        </WalletProvider>
      </StoreProvider>
    </QueryProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
