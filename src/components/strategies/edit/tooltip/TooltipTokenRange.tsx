import { Tooltip } from 'components/common/tooltip/Tooltip';
import { TokenPrice } from 'components/strategies/overview/strategyBlock/TokenPrice';
import { Token } from 'libs/tokens';
import { FC } from 'react';
import { cn, prettifyNumber, sanitizeNumberInput } from 'utils/helpers';
import { useFiatValue } from 'hooks/useFiatValue';
import { LogoImager } from 'components/common/imager/Imager';

export interface TooltipPriceProps {
  range: {
    min: string;
    max: string;
  };
  token: Token;
  className?: string;
}

export const TooltipTokenRange: FC<TooltipPriceProps> = ({
  range,
  token,
  className,
}) => {
  const { min, max } = range;
  const minFiatPrice = useFiatValue({ price: min, token });
  const maxFiatPrice = useFiatValue({ price: max, token });
  const minFullPrice = sanitizeNumberInput(min, token.decimals);
  const maxFullPrice = sanitizeNumberInput(max, token.decimals);
  return (
    <Tooltip
      element={
        <>
          <div className="align-center flex gap-6">
            <TokenPrice price={minFullPrice} />
            -
            <TokenPrice price={maxFullPrice} />
            {token.symbol}
          </div>
          <div className="align-center flex gap-6">
            <TokenPrice className="text-white/60" price={minFiatPrice} />
            -
            <TokenPrice className="text-white/60" price={maxFiatPrice} />
          </div>
        </>
      }
    >
      <div className={cn('align-center flex flex gap-7', className)}>
        {prettifyNumber(min)} - {prettifyNumber(max)} {token.symbol}
        <LogoImager
          className="h-16 w-16"
          src={token.logoURI}
          alt={token.name ?? 'Token'}
        />
      </div>
    </Tooltip>
  );
};
