import axios from 'axios';
import { ethToken, wethToken } from './web3/config';
import { uniqBy } from 'lodash';
import { utils } from 'ethers';

export interface Token {
  address: string;
  decimals: number;
  logoURI?: string;
  name?: string;
  symbol: string;
  balance?: string;
}

export interface TokenList {
  id: string;
  name: string;
  logoURI?: string;
  tokens: Token[];
}

export const listOfLists = [
  {
    uri: 'https://d1wmp5nysbq9xl.cloudfront.net/ethereum/tokens.json',
    name: 'Bancor',
  },
  {
    uri: 'https://tokens.coingecko.com/ethereum/all.json',
    name: 'CoinGecko',
  },
  {
    uri: 'https://tokenlist.zerion.eth.link',
    name: 'Zerion',
  },
  {
    uri: 'https://zapper.fi/api/token-list',
    name: 'Zapper Token List',
  },
  {
    uri: 'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json',
    name: 'Compound',
  },
  {
    uri: 'https://uniswap.mycryptoapi.com',
    name: 'MyCrypto Token List',
  },
  {
    uri: 'https://tokenlist.aave.eth.link',
    name: 'Aave Token List',
  },
  {
    uri: 'https://defiprime.com/defiprime.tokenlist.json',
    name: 'Defiprime',
  },
];

const getLogoByURI = (uri: string | undefined) =>
  uri && uri.startsWith('ipfs') ? buildIpfsUri(uri.split('//')[1]) : uri;

const buildIpfsUri = (ipfsHash: string) => `https://ipfs.io/ipfs/${ipfsHash}`;

export const fetchTokenLists = async () => {
  const res = await Promise.all(
    listOfLists.map(async (list) => {
      try {
        const res = await axios.get<TokenList>(list.uri, { timeout: 10000 });
        return {
          ...res.data,
          logoURI: getLogoByURI(res.data.logoURI),
        };
      } catch (error) {}

      return undefined;
    })
  );

  return res.filter((x) => !!x) as TokenList[];
};

export const tokenList = async () => {
  const res = await fetchTokenLists();
  return buildTokenList(res);
};

const buildTokenList = (tokenList: TokenList[]): Token[] => {
  const tokens: Token[] = [
    {
      symbol: 'ETH',
      address: ethToken,
      logoURI:
        'https://d1wmp5nysbq9xl.cloudfront.net/ethereum/tokens/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.svg',
      decimals: 18,
      name: 'Ethereum',
    },
    {
      symbol: 'WETH',
      address: wethToken,
      logoURI:
        'https://d1wmp5nysbq9xl.cloudfront.net/ethereum/tokens/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.svg',
      decimals: 18,
      name: 'Wrapped Ethereum',
    },
  ];

  const merged = tokenList
    .flatMap((list) => list.tokens)
    .filter((token) => !!token.address)
    .map((token) => ({
      ...token,
      address: utils.getAddress(token.address),
    }));

  tokens.push(...merged);

  return uniqBy(tokens, (token: Token) => token.address);
};
