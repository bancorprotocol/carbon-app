import { MakeGenerics } from 'libs/routing';

export type ExplorerType = 'wallet' | 'token-pair';

export type ExplorerRouteGenerics = MakeGenerics<{
  Params: {
    type: ExplorerType;
    slug?: string;
    address?: string;
  };
}>;
