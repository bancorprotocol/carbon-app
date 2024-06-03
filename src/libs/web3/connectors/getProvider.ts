import { InjectedProvider } from '../web3.types';

/*
 * Returns the explicit window provider that matches the flag and the flag is true
 */
function getExplicitInjectedProvider(flag: InjectedProvider['flag']) {
  if (
    typeof window === 'undefined' ||
    typeof (window as any).ethereum === 'undefined'
  )
    return;
  const providers = window.ethereum.providers;

  if (providers)
    return providers.find((provider: { [x: string]: any }) => provider[flag]);

  if (window.ethereum[flag]) return window.ethereum;

  return;
}

/*
 * Gets the `window.namespace` window provider if it exists
 */
function getWindowProviderNamespace(namespace: string) {
  const providerSearch = (provider: any, namespace: string): any => {
    const [property, ...path] = namespace.split('.');
    const _provider = provider[property];
    if (_provider) {
      if (path.length === 0) return _provider;
      return providerSearch(_provider, path.join('.'));
    }
  };
  if (typeof window !== 'undefined') return providerSearch(window, namespace);
}

/*
 * Checks if the explicit provider or window ethereum exists
 */
export function hasInjectedProvider({ flag, namespace }: InjectedProvider) {
  if (namespace && typeof getWindowProviderNamespace(namespace) !== 'undefined')
    return true;
  if (flag && typeof getExplicitInjectedProvider(flag) !== 'undefined')
    return true;
  return false;
}

/*
 * Returns an injected provider that favors the flag match, but falls back to window.ethereum
 */
export function getInjectedProvider({ flag, namespace }: InjectedProvider) {
  if (
    typeof window === 'undefined' ||
    typeof (window as any).ethereum === 'undefined'
  )
    return;
  if (namespace) {
    // prefer custom eip1193 namespaces
    const windowProvider = getWindowProviderNamespace(namespace);
    if (windowProvider) return windowProvider;
  }
  const providers = window.ethereum.providers;
  if (flag) {
    const provider = getExplicitInjectedProvider(flag);
    if (provider) return provider;
  }
  if (typeof providers !== 'undefined' && providers.length > 0)
    return providers[0];
  return window.ethereum;
}
