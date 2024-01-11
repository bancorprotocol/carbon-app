import { SafeDecimal } from 'libs/safedecimal';
import { FC } from 'react';
import { useStore } from 'store';
import { cn, getFiatDisplayValue } from 'utils/helpers';

type Props = {
  totalValue: SafeDecimal;
  assetsCount: number;
};

export const PortfolioAllTokensPieChartCenter: FC<Props> = ({
  totalValue,
  assetsCount,
}) => {
  const {
    fiatCurrency: { selectedFiatCurrency },
  } = useStore();

  return (
    <div className={cn('flex', 'flex-col', 'items-center', 'space-y-6')}>
      <div className={cn('text-24', 'font-weight-500')}>
        {getFiatDisplayValue(totalValue, selectedFiatCurrency)}
      </div>
      <div className={cn('text-white/60', 'font-weight-500')}>
        {assetsCount} Assets
      </div>
    </div>
  );
};
