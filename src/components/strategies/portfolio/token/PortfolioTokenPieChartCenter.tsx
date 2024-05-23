import { LogoImager } from 'components/common/imager/Imager';
import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { buildAmountString } from 'components/strategies/portfolio/utils';
import { FC } from 'react';
import { useStore } from 'store';
import { getFiatDisplayValue } from 'utils/helpers';

type Props = {
  data?: PortfolioData;
};

export const PortfolioTokenPieChartCenter: FC<Props> = ({ data }) => {
  const {
    fiatCurrency: { selectedFiatCurrency },
  } = useStore();

  // TODO handle error state
  if (!data) return null;

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="font-weight-500 text-18 flex items-center">
        <LogoImager
          alt="Token Logo"
          src={data.token.logoURI}
          className="mr-10 size-24"
        />
        {data.token.symbol}
      </div>
      <div className="text-20 font-weight-500">
        {getFiatDisplayValue(data.value, selectedFiatCurrency)}
      </div>
      <div className="font-weight-500 text-white/60">
        {buildAmountString(data.amount, data.token)}
      </div>
      <div className="font-weight-500 text-white/60">
        {getStrategyText(data.strategies.length)}
      </div>
    </div>
  );
};

function getStrategyText(numStrategies: number) {
  const text = numStrategies > 1 ? 'Strategies' : 'Strategy';
  return `${numStrategies} ${text}`;
}
