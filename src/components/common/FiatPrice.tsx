import { useGetTokenPrice } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';
import { FC } from 'react';
import { cn, getUsdPrice } from 'utils/helpers';

interface Props {
  token?: Token;
  amount: SafeDecimal | string | number;
  className?: string;
}
export const FiatPrice: FC<Props> = ({ token, amount, className }) => {
  const query = useGetTokenPrice(token?.address);
  const loading = !token || query.isPending;
  const value = new SafeDecimal(query.data || 0).mul(amount);
  return (
    <span className={cn(className, { invisible: loading })}>
      {getUsdPrice(value)}
    </span>
  );
};
