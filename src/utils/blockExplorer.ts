import config from 'config';
export const getExplorerLink = (type: 'token' | 'tx', value: string) => {
  switch (type) {
    case 'token':
      return `${config.blockExplorer}/token/${value}`;
    case 'tx':
      return `${config.blockExplorer}/tx/${value}`;
  }
};
