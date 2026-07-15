import { TokenLogo } from 'components/common/imager/Imager';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { StrategyDirection } from 'libs/routing';
import { Token } from 'libs/tokens';
import { FC } from 'react';

export interface OrderTitleProps {
  titleId: string;
  base: Token;
  direction: StrategyDirection;
}

export const OrderTitle: FC<OrderTitleProps> = (props) => {
  const { titleId, direction, base } = props;
  const tooltipText = `This section will define the order details in which you are willing to ${direction} ${base.symbol} at.`;
  const isBuy = direction === 'buy';
  return (
    <h2 className="text-18 me-auto flex items-center gap-8" id={titleId}>
      <Tooltip element={tooltipText}>
        <span>{isBuy ? 'Buy Low' : 'Sell High'}</span>
      </Tooltip>
      <TokenLogo token={base} size={18} />
      <span>{base.symbol}</span>
    </h2>
  );
};
