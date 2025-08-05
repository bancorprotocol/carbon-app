import { TokenList } from 'libs/tokens';

export const tokenTonToTacParser = (
  data: any,
): TokenList | Promise<TokenList> => {
  for (const token of data.tokens) {
    // Is TON native token address
    if (token.address === '0xb76d91340F5CE3577f0a056D29f6e3Eb4E88B140') {
      token.tonAddress = 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c';
    } else {
      token.tonAddress = token.extensions.jetton;
    }
  }
  return data;
};
