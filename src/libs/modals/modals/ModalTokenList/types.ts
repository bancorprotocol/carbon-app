import { Token } from 'libs/tokens';

export interface ModalTokenListData {
  onClick: (token: Token) => void;
  excludedTokens?: string[];
  includedTokens?: string[];
  isBaseToken?: boolean;
}
