import { Token } from 'libs/tokens';
import { FC } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
import { prettifyNumber } from 'utils/helpers';
import { Warning } from 'components/common/WarningMessageWithIcon';

interface Props {
  base?: Token;
  quote?: Token;
  buyBudget: string;
  htmlFor: string;
}
export const OverlappingSmallBudget: FC<Props> = (props) => {
  const { base, quote, buyBudget, htmlFor } = props;
  if (!base || !quote) return <></>;
  const isBuyTooSmall = new SafeDecimal(buyBudget).eq(0);

  const wei = isBuyTooSmall
    ? new SafeDecimal(10).pow(-1 * (quote.decimals + 1)).toString()
    : new SafeDecimal(10).pow(-1 * (base.decimals + 1)).toString();
  const token = isBuyTooSmall ? quote : base;
  const otherToken = isBuyTooSmall ? base : quote;

  return (
    <Warning isError htmlFor={htmlFor}>
      Please increase {otherToken.symbol} budget to have at least&nbsp;
      {prettifyNumber(wei)} {token.symbol}
    </Warning>
  );
};
