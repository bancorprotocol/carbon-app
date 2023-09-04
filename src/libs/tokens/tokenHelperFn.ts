import axios from 'axios';
import { config } from 'services/web3/config';
import { uniqBy } from 'lodash';
import { utils } from 'ethers';
import { Token, TokenList } from 'libs/tokens/token.types';
import { Token as TokenContract } from 'abis/types';
import { lsService } from 'services/localeStorage';

export const listOfLists = [
  {
    uri: 'https://d1wmp5nysbq9xl.cloudfront.net/ethereum/tokens.json',
    name: 'Bancor',
  },
  {
    uri: 'https://tokens.coingecko.com/ethereum/all.json',
    name: 'CoinGecko',
  },
];

const getLogoByURI = (uri: string | undefined) =>
  uri && uri.startsWith('ipfs') ? buildIpfsUri(uri.split('//')[1]) : uri;

const buildIpfsUri = (ipfsHash: string) => `https://ipfs.io/ipfs/${ipfsHash}`;

export const fetchTokenLists = async () => {
  const res = await Promise.all(
    listOfLists.map(async (list) => {
      const res = await axios.get<TokenList>(list.uri, { timeout: 10000 });
      return {
        ...res.data,
        logoURI: getLogoByURI(res.data.logoURI),
      };
    })
  );

  return res.filter((x) => !!x) as TokenList[];
};

export const buildTokenList = (tokenList: TokenList[]): Token[] => {
  const tokens: Token[] = [
    {
      symbol: 'ETH',
      address: config.tokens.ETH,
      logoURI:
        'https://d1wmp5nysbq9xl.cloudfront.net/ethereum/tokens/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.svg',
      decimals: 18,
      name: 'Ethereum',
    },
    {
      symbol: 'WETH',
      address: config.tokens.WETH,
      logoURI:
        'https://d1wmp5nysbq9xl.cloudfront.net/ethereum/tokens/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.svg',
      decimals: 18,
      name: 'Wrapped Ethereum',
    },
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
  lsService.removeItem('importedTokens');
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
