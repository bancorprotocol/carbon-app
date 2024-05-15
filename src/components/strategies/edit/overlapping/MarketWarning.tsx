import { SafeDecimal } from 'libs/safedecimal';
import { FC } from 'react';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';

interface Props {
  externalMarketPrice?: number;
  oldMarketPrice?: SafeDecimal;
}
export const MarketWarning: FC<Props> = (props) => {
  const { externalMarketPrice, oldMarketPrice } = props;
  if (!oldMarketPrice || !externalMarketPrice) return <></>;
  const delta = new SafeDecimal(externalMarketPrice)
    .div(oldMarketPrice)
    .minus(1)
    .abs();
  if (delta.lt(0.05)) return <></>;
  return (
    <div className="text-warning flex items-center gap-8">
      <IconWarning className="size-16" />
      <p className="text-12 font-weight-400">
        Please note that the deposit budget might create an arb opportunity.
      </p>
    </div>
  );
};
