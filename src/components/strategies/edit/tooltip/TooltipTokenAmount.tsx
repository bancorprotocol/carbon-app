import { Tooltip } from 'components/common/tooltip/Tooltip';
import { TokenPrice } from 'components/strategies/overview/strategyBlock/TokenPrice';
import { Token } from 'libs/tokens';
import { FC } from 'react';
import { cn, prettifyNumber } from 'utils/helpers';
import { useFiatValue } from 'hooks/useFiatValue';
import { LogoImager } from 'components/common/imager/Imager';

export interface TooltipPriceProps {
  amount: string;
  token: Token;
  className?: string;
}

export const TooltipTokenAmount: FC<TooltipPriceProps> = (props) => {
  const { amount, token, className } = props;
  const fiatPrice = useFiatValue({ price: amount, token, fullValue: true });
  const fullAmount = prettifyNumber(amount, {
    fullValue: true,
    decimals: token.decimals,
  });
  return (
    <Tooltip
      element={
        <>
          <p className="align-center flex flex gap-6">
            <TokenPrice price={fullAmount} />
            {token.symbol}
          </p>
          <TokenPrice className="text-white/60" price={fiatPrice} />
        </>
      }
    >
      <div className={cn('align-center flex flex gap-7', className)}>
        {prettifyNumber(amount)}
        <LogoImager
          className="h-16 w-16"
          src={token.logoURI}
          alt={token.name ?? 'Token'}
        />
      </div>
    </Tooltip>
  );
};
