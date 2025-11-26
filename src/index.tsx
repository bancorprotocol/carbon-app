import 'global-shim';
import React, { lazy, ReactNode } from 'react';
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
import TelegramAnalytics from '@telegram-apps/analytics';
import config from 'config';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const TonProvider = lazy(() => import('libs/ton/TonProvider'));

const WalletProvider = ({ children }: { children: ReactNode }) => {
  if (config.network.name === 'TON') {
    return <TonProvider>{children}</TonProvider>;
  } else {
    return <WagmiReactWrapper>{children}</WagmiReactWrapper>;
  }
};

if (config.network.name === 'TON') {
  TelegramAnalytics.init({
    token: import.meta.env.VITE_TON_ANALYTICS_TOKEN,
    appName: 'Carbondefiappbot',
  });
}

root.render(
  <React.StrictMode>
    <QueryProvider>
      <SDKProvider>
        <StoreProvider>
          <WalletProvider>
            <LazyMotion>
              <RouterProvider router={router} />
            </LazyMotion>
          </WalletProvider>
        </StoreProvider>
      </SDKProvider>
    </QueryProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
