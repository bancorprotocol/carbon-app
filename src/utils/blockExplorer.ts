const EXPLORER_BASE_URL = 'https://etherscan.io';
export const getExplorerLink = (type: 'token' | 'tx', value: string) => {
  switch (type) {
    case 'token':
      return `${EXPLORER_BASE_URL}/token/${value}`;
    case 'tx':
      return `${EXPLORER_BASE_URL}/tx/${value}`;
  }
};
