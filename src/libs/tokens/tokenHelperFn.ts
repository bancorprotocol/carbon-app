import { getEVMTokenAddress, getTVMTokenAddress } from 'libs/ton/address';
import { getAddress } from 'ethers';
import { Token, TokenList } from 'libs/tokens/token.types';
import { Token as TokenContract } from 'abis/types';
import { tokenParserMap } from 'config/utils';
import { TonToken } from 'libs/ton/tokenMap';
import { getTonTokenData } from 'libs/ton/api';
import config from 'config';

const getLogoByURI = (uri: string | undefined) =>
  uri && uri.startsWith('ipfs') ? buildIpfsUri(uri.split('//')[1]) : uri;

const buildIpfsUri = (ipfsHash: string) => `https://ipfs.io/ipfs/${ipfsHash}`;

export const fetchTokenLists = async () => {
  const res = await Promise.all(
    config.tokenLists.map(async ({ uri, parser }) => {
      const controller = new AbortController();
      const abort = setTimeout(() => controller.abort(), 10_000);
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

  const record = new Map<string, Token>();
  for (const token of tokens) {
    record.set(token.address, token);
  }

  for (const list of tokenList) {
    for (const token of list.tokens) {
      if (!token.address) continue;
      if (!token.symbol) continue;
      if (token.address === config.addresses.tokens.ZERO) continue;
      const address = getAddress(token.address);
      if (record.has(address)) continue;
      record.set(address, { ...token, address });
    }
  }
  return Array.from(record.values());
};

export const fetchTokenData = async (
  Token: (address: string) => { read: TokenContract },
  address: string,
): Promise<Token> => {
  try {
    if (config.network.name === 'TON') {
      const tonAddress = await getTVMTokenAddress(address);
      const [token, evmAddress] = await Promise.all([
        getTonTokenData(tonAddress),
        getEVMTokenAddress(address),
      ]);
      if (!token) {
        throw new Error('Could not find TON token');
      }
      return {
        ...token,
        address: evmAddress,
        tonAddress: tonAddress,
        isSuspicious: true,
      } as TonToken;
    } else {
      const [symbol, decimals, name] = await Promise.all([
        Token(address).read.symbol(),
        Token(address).read.decimals(),
        Token(address).read.name(),
      ]);
      return {
        address,
        symbol,
        decimals: Number(decimals),
        name,
        isSuspicious: true,
      };
    }
  } catch (err) {
    console.error('Could not fetch information from ' + address);
    throw err;
  }
};
