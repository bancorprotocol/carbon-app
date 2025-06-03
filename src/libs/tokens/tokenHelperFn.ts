import { getAddress } from '@ethersproject/address';
import { Token, TokenList } from 'libs/tokens/token.types';
import { Token as TokenContract } from 'abis/types';
import { lsService } from 'services/localeStorage';
import { tokenParserMap } from 'config/utils';
import config from 'config';

const getLogoByURI = (uri: string | undefined) =>
  uri && uri.startsWith('ipfs') ? buildIpfsUri(uri.split('//')[1]) : uri;

const buildIpfsUri = (ipfsHash: string) => `https://ipfs.io/ipfs/${ipfsHash}`;

export const fetchTokenLists = async () => {
  const res = await Promise.all(
    config.tokenLists.map(async ({ uri, parser }) => {
      const controller = new AbortController();
      const abort = setTimeout(() => {
        controller.abort();
      }, 10000);
      const response = await fetch(uri, { signal: controller.signal });
      clearTimeout(abort);
      const result: TokenList = await response.json();

      if (!response.ok) {
        const error = (result as { error?: string }).error;
        throw new Error(
          error ||
            `Failed to fetch token list. ${response.statusText} response received.`,
        );
      }

      const parsedResult = parser
        ? await tokenParserMap[parser](result)
        : result;

      const filteredTokens = parsedResult.tokens.filter(
        (token) =>
          token?.chainId === undefined ||
          token?.chainId === config.network.chainId,
      );

      return {
        ...parsedResult,
        tokens: filteredTokens,
        logoURI: getLogoByURI(parsedResult.logoURI),
      };
    }),
  );

  return res.filter((x) => !!x) as TokenList[];
};

export const buildTokenList = (tokenList: TokenList[]): Token[] => {
  const tokens: Token[] = [
    config.network.gasToken,
    ...config.tokenListOverride,
  ];

  const record: Record<string, Token> = {};
  for (const list of tokenList) {
    for (const token of list.tokens) {
      if (!token.address || !token.symbol) continue;
      const address = getAddress(token.address);
      record[address] ||= { ...token, address };
    }
  }
  tokens.push(...Object.values(record));

  const lsImportedTokens = lsService.getItem('importedTokens') ?? [];
  const result = new Map<string, Token>();
  for (const token of lsImportedTokens) result.set(token.address, token);
  for (const token of tokens) result.set(token.address, token);
  return Array.from(result.values());
};

export const fetchTokenData = async (
  Token: (address: string) => { read: TokenContract },
  address: string,
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
