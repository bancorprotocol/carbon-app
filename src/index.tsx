import React from 'react';
import ReactDOM from 'react-dom/client';
import 'index.css';
import { ModalProvider } from 'modals';
import { App } from 'App';
import reportWebVitals from 'reportWebVitals';
import { Web3ReactWrapper } from 'web3';
import { domAnimation, LazyMotion } from 'framer-motion';
import { NotificationProvider } from 'notifications/NotificationsProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <LazyMotion features={domAnimation} strict>
      <NotificationProvider>
        <Web3ReactWrapper>
          <ModalProvider>
            <App />
          </ModalProvider>
        </Web3ReactWrapper>
      </NotificationProvider>
    </LazyMotion>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
