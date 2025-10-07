import { SafeDecimal } from 'libs/safedecimal';
import { FC } from 'react';
import { useStore } from 'store';
import { getFiatDisplayValue } from 'utils/helpers';

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
    <div className="flex flex-col items-center gap-4">
      <div className="text-24 font-medium">
        {getFiatDisplayValue(totalValue, selectedFiatCurrency)}
      </div>
      <div className="text-white/60 font-medium">{assetsCount} Assets</div>
    </div>
  );
};
