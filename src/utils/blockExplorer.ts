import config from 'config';
export const getExplorerLink = (type: 'token' | 'tx', value: string) => {
  switch (type) {
    case 'token':
      return `${config.network.blockExplorer.url}/token/${value}`;
    case 'tx':
      return `${config.network.blockExplorer.url}/tx/${value}`;
  }
};
