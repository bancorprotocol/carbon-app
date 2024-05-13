import { uniqBy } from 'lodash';
import { utils } from 'ethers';
import { Token, TokenList } from 'libs/tokens/token.types';
import { Token as TokenContract } from 'abis/types';
import { lsService } from 'services/localeStorage';
import config from 'config';

const getLogoByURI = (uri: string | undefined) =>
  uri && uri.startsWith('ipfs') ? buildIpfsUri(uri.split('//')[1]) : uri;

const buildIpfsUri = (ipfsHash: string) => `https://ipfs.io/ipfs/${ipfsHash}`;

export const fetchTokenLists = async () => {
  const res = await Promise.all(
    config.tokenLists.map(async ({ uri, parser }) => {
      const signal = AbortSignal.timeout(10000);
      const response = await fetch(uri, { signal });
      const result: TokenList = await response.json();

      if (!response.ok) {
        const error = (result as { error?: string }).error;
        throw new Error(
          error ||
            `Failed to fetch token list. ${response.statusText} response received.`
        );
      }

      const parsedResult = parser ? parser(result) : result;

      return {
        ...parsedResult,
        logoURI: getLogoByURI(parsedResult.logoURI),
      };
    })
  );

  return res.filter((x) => !!x) as TokenList[];
};

export const buildTokenList = (tokenList: TokenList[]): Token[] => {
  const tokens: Token[] = [
    config.network.gasToken,
    ...config.tokenListOverride,
  ];

  const merged = tokenList
    .flatMap((list) => list.tokens)
    .filter((token) => !!token.address && !!token.symbol)
    .map((token) => ({
      ...token,
      address: utils.getAddress(token.address),
    }));
  tokens.push(...merged);

  const lsImportedTokens = lsService.getItem('importedTokens') ?? [];
  tokens.push(...lsImportedTokens);

  return uniqBy(tokens, (token: Token) => token.address);
};

export const fetchTokenData = async (
  Token: (address: string) => { read: TokenContract },
  address: string
): Promise<Token> => {
  const [symbol, decimals, name] = await Promise.all([
    Token(address).read.symbol(),
    Token(address).read.decimals(),
    Token(address).read.name(),
  ]);
  return {
    address,
    symbol,
    decimals,
    name,
    isSuspicious: true,
  };
};
