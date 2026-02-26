import { Tooltip } from 'components/common/tooltip/Tooltip';
import { TokenPrice } from 'components/strategies/overview/strategyBlock/TokenPrice';
import { Token } from 'libs/tokens';
import { FC } from 'react';
import { cn, prettifyNumber } from 'utils/helpers';
import { useFiatValue } from 'hooks/useFiatValue';
import { TokenLogo } from 'components/common/imager/Imager';

export interface TooltipPriceProps {
  amount: string;
  token: Token;
  className?: string;
}

export const TooltipTokenAmount: FC<TooltipPriceProps> = (props) => {
  const { amount, token, className } = props;
  const fiatPrice = useFiatValue({ price: amount, token, highPrecision: true });
  const fullAmount = prettifyNumber(amount, {
    highPrecision: true,
    decimals: token.decimals,
  });
  return (
    <Tooltip
      element={
        <>
          <div className="align-center flex gap-6">
            <TokenPrice price={fullAmount} />
            {token.symbol}
          </div>
          {fiatPrice && (
            <TokenPrice className="text-main-0/60" price={fiatPrice} />
          )}
        </>
      }
    >
      <div className={cn('align-center flex gap-7', className)}>
        {prettifyNumber(amount)}
        <TokenLogo token={token} size={16} />
      </div>
    </Tooltip>
  );
};
