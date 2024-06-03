import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { initializeConnector } from '@web3-react/core';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { WalletConnect } from '@web3-react/walletconnect-v2';
import { Network } from '@web3-react/network';
import { GnosisSafe } from '@web3-react/gnosis-safe';
import { TailwindConnector } from '@tailwindzone/connect-web3-react';
import iconMetaMask from 'assets/logos/metamask.svg';
import iconWalletConnect from 'assets/logos/walletConnect.svg';
import iconCoinbase from 'assets/logos/coinbase.svg';
import iconTailwindWallet from 'assets/logos/tailwindWallet.svg';
import iconCompassWallet from 'assets/logos/compassWallet.svg';
import iconSeifWallet from 'assets/logos/seifWallet.svg';
import iconGnosis from 'assets/logos/gnosis.svg';
import carbonLogo from 'assets/logos/carbon.svg';
import config from 'config';
import {
  RPC_HEADERS,
  RPC_URLS,
  SelectedConnectionTypes,
  SupportedChainId,
} from 'libs/web3/web3.constants';
import { Connection } from 'libs/web3/web3.types';
import { SafeEIP1193 } from './connectors/SafeEIP1193';
import { injectedProviders } from 'libs/web3/web3.constants';

const onError = (error: Error) => {
  console.debug(`web3-react error: ${error}`);
};

// Takes a connector name and returns an initialized web3-react connector
export function createConnection(
  connector: SelectedConnectionTypes
): Connection {
  switch (connector) {
    case 'network':
      // ********************************** //
      // NETWORK CONNECTOR
      // ********************************** //

      const [web3Network, web3NetworkHooks] = initializeConnector<Network>(
        (actions) =>
          new Network({
            actions,
            urlMap: {
              ...RPC_URLS,
              [SupportedChainId.MAINNET]: new StaticJsonRpcProvider({
                url: RPC_URLS[SupportedChainId.MAINNET],
                headers: RPC_HEADERS[SupportedChainId.MAINNET],
                skipFetchSetup: true,
              }),
            },
            defaultChainId: SupportedChainId.MAINNET,
          })
      );
      return {
        connector: web3Network,
        hooks: web3NetworkHooks,
        type: 'network',
        name: 'Network',
      };
    case 'injected':
      // ********************************** //
      // METAMASK CONNECTOR
      // ********************************** //

      const [web3MetaMask, web3MetaMaskHooks] =
        initializeConnector<SafeEIP1193>(
          (actions) =>
            new SafeEIP1193({
              actions,
              injectedProvider: injectedProviders.metamask,
              onError,
            })
        );
      return {
        connector: web3MetaMask,
        hooks: web3MetaMaskHooks,
        type: connector,
        name: 'MetaMask',
        logoUrl: iconMetaMask,
      };

    case 'gnosisSafe':
      // ********************************** //
      // GNOSIS CONNECTOR
      // ********************************** //

      const [web3GnosisSafe, web3GnosisSafeHooks] =
        initializeConnector<GnosisSafe>(
          (actions) => new GnosisSafe({ actions })
        );
      return {
        connector: web3GnosisSafe,
        hooks: web3GnosisSafeHooks,
        type: connector,
        name: 'Gnosis Safe',
        logoUrl: iconGnosis,
      };

    case 'walletConnect':
      // ********************************** //
      // WALLETCONNECT CONNECTOR
      // ********************************** //

      const [web3WalletConnect, web3WalletConnectHooks] =
        initializeConnector<WalletConnect>(
          (actions) =>
            new WalletConnect({
              actions,
              options: {
                projectId: config.walletConnectProjectId,
                rpc: RPC_URLS,
                showQrModal: true,
                chains: [SupportedChainId.MAINNET],
                metadata: {
                  name: 'Carbon',
                  description:
                    'Trade tokens or create automated onchain trading strategies',
                  url: config.appUrl,
                  icons: [`${config.appUrl}/logo512.png`],
                },
              },
              onError,
            })
        );
      return {
        connector: web3WalletConnect,
        hooks: web3WalletConnectHooks,
        type: connector,
        name: 'WalletConnect',
        logoUrl: iconWalletConnect,
      };

    case 'coinbaseWallet':
      // ********************************** //
      // COINBASE WALLET CONNECTOR
      // ********************************** //

      const [web3CoinbaseWallet, web3CoinbaseWalletHooks] =
        initializeConnector<CoinbaseWallet>(
          (actions) =>
            new CoinbaseWallet({
              actions,
              options: {
                url: RPC_URLS[SupportedChainId.MAINNET],
                appName: 'Carbon',
                appLogoUrl: carbonLogo,
                reloadOnDisconnect: false,
              },
              onError,
            })
        );
      return {
        connector: web3CoinbaseWallet,
        hooks: web3CoinbaseWalletHooks,
        type: connector,
        name: 'Coinbase Wallet',
        logoUrl: iconCoinbase,
      };

    case 'tailwindWallet':
      // ********************************** //
      // Tailwind WALLET CONNECTOR
      // ********************************** //

      const [web3TailwindWallet, web3TailwindWalletHooks] =
        initializeConnector<TailwindConnector>(
          (actions) => new TailwindConnector({ actions })
        );
      return {
        connector: web3TailwindWallet,
        hooks: web3TailwindWalletHooks,
        type: connector,
        name: 'Tailwind Wallet',
        logoUrl: iconTailwindWallet,
      };

    case 'compassWallet':
      // ********************************** //
      // Compass WALLET CONNECTOR
      // ********************************** //

      const [web3CompassWallet, web3CompassWalletHooks] =
        initializeConnector<SafeEIP1193>(
          (actions) =>
            new SafeEIP1193({
              actions,
              injectedProvider: injectedProviders.compassWallet,
              onError,
            })
        );
      return {
        connector: web3CompassWallet,
        hooks: web3CompassWalletHooks,
        type: connector,
        name: 'Compass Wallet',
        logoUrl: iconCompassWallet,
      };

    case 'seifWallet':
      // ********************************** //
      // Seif WALLET CONNECTOR
      // ********************************** //

      const [web3SeifWallet, web3SeifWalletHooks] =
        initializeConnector<SafeEIP1193>(
          (actions) =>
            new SafeEIP1193({
              actions,
              injectedProvider: injectedProviders.seifWallet,
              onError,
            })
        );
      return {
        connector: web3SeifWallet,
        hooks: web3SeifWalletHooks,
        type: connector,
        name: 'Seif Wallet',
        logoUrl: iconSeifWallet,
      };
  }
}
