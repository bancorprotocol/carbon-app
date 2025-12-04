import 'global-shim';
import React, { lazy, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from 'reportWebVitals';
import { StoreProvider } from 'store';
import { WagmiReactWrapper } from 'libs/wagmi';
import { QueryProvider } from 'libs/queries';
import { RouterProvider, router } from 'libs/routing';
import { SDKProvider } from 'libs/sdk/provider';
import TelegramAnalytics from '@telegram-apps/analytics';
import config from 'config';
import 'init-sentry';
import 'fonts.css';
import 'index.css';
import { SDKProvider } from 'libs/sdk/provider';
import { init as initTelegramSDK } from '@tma.js/sdk';
import TelegramAnalytics from '@telegram-apps/analytics';

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
  try {
    initTelegramSDK();
    TelegramAnalytics.init({
      token: import.meta.env.VITE_TON_ANALYTICS_TOKEN,
      appName: 'carbondefi',
    });
  } catch (err) {
    console.error(err);
  }
}

root.render(
  <React.StrictMode>
    <QueryProvider>
      <SDKProvider>
        <StoreProvider>
          <WalletProvider>
            <RouterProvider router={router} />
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
