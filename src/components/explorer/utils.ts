import { MakeGenerics } from 'libs/routing';

export type ExplorerRouteGenerics = MakeGenerics<{
  Params: {
    type: 'wallet' | 'token-pair';
    slug?: string;
    address?: string;
  };
}>;

export const slugSeparator = '_';
export const nameSeparator = '/';

export const searchSeparators = [nameSeparator, ' '];
