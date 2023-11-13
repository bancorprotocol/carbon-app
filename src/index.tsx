import 'global-shim';
import 'init-sentry';
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from 'reportWebVitals';
import { StoreProvider } from 'store';
import { Web3ReactWrapper } from 'libs/web3';
import { LazyMotion } from 'libs/motion';
import { QueryProvider } from 'libs/queries';
import { router } from 'libs/routing/router';
import { RouterProvider } from '@tanstack/react-router';
import 'utils/buffer';
import 'fonts.css';
import 'index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <QueryProvider>
      <StoreProvider>
        <Web3ReactWrapper>
          <LazyMotion>
            <RouterProvider router={router} />
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
