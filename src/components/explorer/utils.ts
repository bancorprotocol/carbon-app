export type ExplorerType = 'wallet' | 'token-pair';

export type ExplorerParams = {
  type: ExplorerType;
  slug?: string;
  address?: string;
};
