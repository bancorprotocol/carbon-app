import { TokenList } from 'libs/tokens';

export const tokenTonToTacParser = (
  data: any,
): TokenList | Promise<TokenList> => {
  for (const token of data.tokens) {
    // Is TON native token address
    if (!token.extensions?.jetton) {
      token.tonAddress = 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c';
    } else {
      token.tonAddress = token.extensions.jetton;
    }
  }
  return data;
};
