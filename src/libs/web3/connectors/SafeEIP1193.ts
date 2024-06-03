import { EIP1193 } from '@web3-react/eip1193';
import {
  Actions,
  AddEthereumChainParameter,
  Provider,
  ProviderConnectInfo,
  ProviderRpcError,
  RequestArguments,
} from '@web3-react/types';
import { getInjectedProvider, hasInjectedProvider } from './getProvider';
import { InjectedProvider } from '../web3.types';

const emptyProvider: Provider = {
  request: async (_args: RequestArguments) => Promise.resolve(undefined),
  on: (_eventName: string | symbol, _listener: (...args: any[]) => void) =>
    emptyProvider,
  removeListener: (
    _eventName: string | symbol,
    _listener: (...args: any[]) => void
  ) => emptyProvider,
};

function parseChainId(chainId: string | number) {
  return typeof chainId === 'string' ? Number.parseInt(chainId, 16) : chainId;
}

export interface SafeEIP1193ConstructorArgs {
  actions: Actions;
  injectedProvider: InjectedProvider;
  onError?: (error: Error) => void;
}

export class SafeEIP1193 extends EIP1193 {
  private providerName: InjectedProvider['name'];
  private hasProvider: boolean;
  provider: Provider;

  constructor({
    actions,
    injectedProvider,
    onError,
  }: SafeEIP1193ConstructorArgs) {
    const provider = getInjectedProvider(injectedProvider) || emptyProvider;
    super({ actions, provider, onError });
    this.provider = provider;
    this.hasProvider = hasInjectedProvider(injectedProvider);
    this.providerName = injectedProvider.name;
  }

  public async activate(
    desiredChainIdOrChainParameters?: number | AddEthereumChainParameter
  ) {
    if (!this.hasProvider) {
      throw new Error(`${this.providerName} not installed.`);
    }
    return this.isomorphicInitialize().then(async () => {
      super.activate().then(async () => {
        if (desiredChainIdOrChainParameters)
          return this.switchOrAddChain(desiredChainIdOrChainParameters);
      });
    });
  }

  private async isomorphicInitialize(): Promise<void> {
    this.provider.on('connect', ({ chainId }: ProviderConnectInfo): void => {
      this.actions.update({ chainId: parseChainId(chainId) });
    });

    this.provider.on('disconnect', (error: ProviderRpcError): void => {
      this.actions.resetState();
      this.onError?.(error);
    });

    this.provider.on('chainChanged', (chainId: string): void => {
      this.actions.update({ chainId: parseChainId(chainId) });
    });

    this.provider.on('accountsChanged', (accounts: string[]): void => {
      this.actions.update({ accounts });
    });
  }

  private async requestAccounts(): Promise<string[]> {
    return this.provider
      .request({ method: 'eth_requestAccounts' })
      .catch(() =>
        this.provider.request({ method: 'eth_accounts' })
      ) as Promise<string[]>;
  }

  private async switchOrAddChain(
    desiredChainIdOrChainParameters: number | AddEthereumChainParameter
  ): Promise<unknown> {
    const cancelActivation = this.actions.startActivation();

    return this.isomorphicInitialize()
      .then(async () => {
        const accounts = await this.requestAccounts();

        const chainId = (await this.provider.request({
          method: 'eth_chainId',
          params: [],
        })) as string;
        const receivedChainId = parseChainId(chainId);
        const desiredChainId =
          typeof desiredChainIdOrChainParameters === 'number'
            ? desiredChainIdOrChainParameters
            : desiredChainIdOrChainParameters?.chainId;

        // if there's no desired chain, or it's equal to the received, update
        if (
          !desiredChainId ||
          (!isNaN(receivedChainId) && receivedChainId === desiredChainId)
        )
          return this.actions.update({ chainId: receivedChainId, accounts });

        const desiredChainIdHex = `0x${desiredChainId.toString(16)}`;

        return this.provider
          .request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: desiredChainIdHex }],
          })
          .catch((error: ProviderRpcError) => {
            const errorCode =
              (error.data as any)?.originalError?.code || error.code;

            // 4901 indicates that the provider is connected to other chains, just not the requested one
            // https://eips.ethereum.org/EIPS/eip-1193
            // 4902 indicates that the chain has not been added to MetaMask and wallet_addEthereumChain needs to be called
            // https://docs.metamask.io/guide/rpc-api.html#wallet-switchethereumchain
            if (
              (errorCode === 4901 || errorCode === 4902) &&
              typeof desiredChainIdOrChainParameters !== 'number'
            ) {
              // if we're here, we can try to add a new network
              return this.provider.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    ...desiredChainIdOrChainParameters,
                    chainId: desiredChainIdHex,
                  },
                ],
              });
            }

            throw error;
          })
          .then(() => this.activate(desiredChainId));
      })
      .catch((error) => {
        cancelActivation();
        throw error;
      });
  }

  public async connectEagerly() {
    if (!this.hasProvider)
      throw new Error(`${this.providerName} not installed.`);
    try {
      return this.isomorphicInitialize().then(() => super.connectEagerly());
    } catch (error) {
      console.debug('Could not connect eagerly', error);
      this.actions.resetState();
    }
  }
}
