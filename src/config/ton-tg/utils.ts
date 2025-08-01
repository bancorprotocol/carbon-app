import { TokenList } from 'libs/tokens';

export const tokenTonToTacParser = (
  data: any,
): TokenList | Promise<TokenList> => {
  for (const token of data.tokens) {
    token.tacAddress = token.address;
    // Is TON native token address
    if (token.address === '0xb76d91340F5CE3577f0a056D29f6e3Eb4E88B140') {
      token.address = 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c';
    } else {
      token.address = token.extensions.jetton;
    }
  }
  return data;
};
