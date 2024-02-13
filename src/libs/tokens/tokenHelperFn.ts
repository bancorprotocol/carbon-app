import axios from 'axios';
import { config as web3Config } from 'services/web3/config';
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
    config.tokenLists.map(async (uri) => {
      const res = await axios.get<TokenList>(uri, { timeout: 10000 });
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
      address: web3Config.tokens.ETH,
      logoURI:
        'https://d1wmp5nysbq9xl.cloudfront.net/ethereum/tokens/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.svg',
      decimals: 18,
      name: 'Ethereum',
    },
    {
      symbol: 'WETH',
      address: web3Config.tokens.WETH,
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
