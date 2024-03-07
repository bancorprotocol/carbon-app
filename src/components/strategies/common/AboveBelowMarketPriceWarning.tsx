import { Token } from 'libs/tokens';
import { FC } from 'react';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';

interface Props {
  base: Token;
  buy: boolean;
}

export const AboveBelowMarketPriceWarning: FC<Props> = ({ base, buy }) => {
  const warningMarketPriceMessage = buy
    ? `Notice: you offer to buy ${base.symbol} above current market price`
    : `Notice: you offer to sell ${base.symbol} below current market price`;

  return <WarningMessageWithIcon message={warningMarketPriceMessage} />;
};
