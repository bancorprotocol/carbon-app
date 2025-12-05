import { SafeDecimal } from 'libs/safedecimal';
import { FC } from 'react';
import { getUsdPrice } from 'utils/helpers';

type Props = {
  totalValue: SafeDecimal;
  assetsCount: number;
};

export const PortfolioAllTokensPieChartCenter: FC<Props> = ({
  totalValue,
  assetsCount,
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-24 font-medium">{getUsdPrice(totalValue)}</div>
      <div className="text-white/60 font-medium">{assetsCount} Tokens</div>
    </div>
  );
};
