import React from 'react';
import ReactDOM from 'react-dom/client';
import 'utils/buffer';
import 'fonts.css';
import 'index.css';
import { ModalProvider } from 'libs/modals';
import { App } from 'App';
import reportWebVitals from 'reportWebVitals';
import { Web3ReactWrapper } from 'libs/web3';
import { Router } from 'libs/routing';
import { LazyMotion } from 'libs/motion';
import { QueryProvider } from 'libs/queries';
import { TokensProvider } from 'libs/tokens';
import { CarbonSDKProvider } from 'libs/sdk';
import { NotificationProvider } from 'libs/notifications';
import { StoreProvider } from 'store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <StoreProvider>
      <LazyMotion>
        <CarbonSDKProvider>
          <QueryProvider>
            <TokensProvider>
              <Web3ReactWrapper>
                <NotificationProvider>
                  <Router>
                    <ModalProvider>
                      <App />
                    </ModalProvider>
                  </Router>
                </NotificationProvider>
              </Web3ReactWrapper>
            </TokensProvider>
          </QueryProvider>
        </CarbonSDKProvider>
      </LazyMotion>
    </StoreProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
