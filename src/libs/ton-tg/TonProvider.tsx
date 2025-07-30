import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { ReactNode } from 'react';

export const TonProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TonConnectUIProvider manifestUrl="tonconnect-manifest.json">
      {children}
    </TonConnectUIProvider>
  );
};
