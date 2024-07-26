import { Tooltip } from 'components/common/tooltip/Tooltip';
import { TokenPrice } from 'components/strategies/overview/strategyBlock/TokenPrice';
import { Token } from 'libs/tokens';
import { FC } from 'react';
import { cn, prettifyNumber } from 'utils/helpers';
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
  const options = { decimals: token.decimals, highPrecision: true };
  const minFiatPrice = useFiatValue({ price: min, token, highPrecision: true });
  const maxFiatPrice = useFiatValue({ price: max, token, highPrecision: true });
  const minFullPrice = prettifyNumber(min, options);
  const maxFullPrice = prettifyNumber(max, options);
  return (
    <Tooltip
      maxWidth={600}
      element={
        <>
          <div className="align-center flex gap-6">
            <TokenPrice price={minFullPrice} />
            -
            <TokenPrice price={maxFullPrice} />
            {token.symbol}
          </div>
          {minFiatPrice && maxFiatPrice && (
            <div className="align-center flex gap-6">
              <TokenPrice className="text-white/60" price={minFiatPrice} />
              -
              <TokenPrice className="text-white/60" price={maxFiatPrice} />
            </div>
          )}
        </>
      }
    >
      <div className={cn('align-center flex gap-7', className)}>
        {prettifyNumber(min)} - {prettifyNumber(max)} {token.symbol}
        <LogoImager
          className="size-16"
          src={token.logoURI}
          alt={token.name ?? 'Token'}
        />
      </div>
    </Tooltip>
  );
};
