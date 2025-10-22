import { Tooltip } from 'components/common/tooltip/Tooltip';
import { StrategyDirection } from 'libs/routing';
import { Token } from 'libs/tokens';
import { FC } from 'react';

interface Props {
  direction: StrategyDirection;
  base: Token;
  quote: Token;
}

const PriceTitle: FC<Props> = ({ direction, base, quote }) => (
  <Tooltip
    element={`Define the price you are willing to ${direction} ${base.symbol} at. Make sure the price is in ${quote.symbol} tokens.`}
  >
    <p className="flex gap-8">
      <span className="text-white/80">Price</span>
      <span className="text-white/60">
        ({quote.symbol} per 1 {base.symbol})
      </span>
    </p>
  </Tooltip>
);

interface LimitProps extends Props {
  inputId: string;
}
export const PriceLabelLimit: FC<LimitProps> = ({
  base,
  quote,
  inputId,
  direction,
}) => (
  <label
    htmlFor={inputId}
    className="text-14 font-medium flex items-center gap-8"
  >
    <PriceTitle direction={direction} base={base} quote={quote} />
  </label>
);

export const PriceLegendRange: FC<Props> = ({ base, quote, direction }) => (
  <h3 className="text-14 font-medium flex items-center gap-8">
    <PriceTitle direction={direction} base={base} quote={quote} />
  </h3>
);
