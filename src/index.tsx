import 'global-shim';
import 'init-sentry';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from 'reportWebVitals';
import { App } from 'App';
import { StoreProvider } from 'store';
import { Web3ReactWrapper } from 'libs/web3';
import { Router } from 'libs/routing';
import { LazyMotion } from 'libs/motion';
import { QueryProvider } from 'libs/queries';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import 'libs/translations/i18n';
import 'utils/buffer';
import 'fonts.css';
import 'index.css';

// get rid of trailing slash in url by redirecting to the same url without the slash
if (
  window.location.pathname !== '/' &&
  window.location.pathname.endsWith('/')
) {
  window.location.pathname = window.location.pathname.slice(0, -1);
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <QueryProvider>
      <StoreProvider>
        <Web3ReactWrapper>
          <LazyMotion>
            <Router>
              <Suspense
                fallback={
                  <div className={'flex h-screen items-center justify-center'}>
                    <div className="h-80">
                      <CarbonLogoLoading />
                    </div>
                  </div>
                }
              >
                <App />
              </Suspense>
            </Router>
          </LazyMotion>
        </Web3ReactWrapper>
      </StoreProvider>
    </QueryProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
