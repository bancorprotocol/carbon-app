import 'global-shim';
import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from 'reportWebVitals';
import { StoreProvider } from 'store';
import { WagmiReactWrapper } from 'libs/wagmi';
import { LazyMotion } from 'libs/motion';
import { QueryProvider } from 'libs/queries';
import { RouterProvider, router } from 'libs/routing';
import { TonProvider } from 'libs/ton/TonProvider';
import config from 'config';
import 'init-sentry';
import 'fonts.css';
import 'index.css';
import { SDKProvider } from 'libs/sdk/provider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const WalletProvider = ({ children }: { children: ReactNode }) => {
  if (config.network.name === 'TON') {
    return <TonProvider>{children}</TonProvider>;
  } else {
    return <WagmiReactWrapper>{children}</WagmiReactWrapper>;
  }
};

if (config.network.name === 'TON') {
  const { default: TelegramAnalytics } = await import(
    '@telegram-apps/analytics'
  );
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
