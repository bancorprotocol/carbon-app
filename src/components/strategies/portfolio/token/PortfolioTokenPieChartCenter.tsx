import { LogoImager } from 'components/common/imager/Imager';
import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { buildAmountString } from 'components/strategies/portfolio/utils';
import { FC } from 'react';
import { useStore } from 'store';
import { cn, getFiatDisplayValue } from 'utils/helpers';

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
    <div className={cn('flex', 'flex-col', 'items-center', 'space-y-6')}>
      <div className={cn('flex', 'items-center', 'font-weight-500', 'text-18')}>
        <LogoImager
          alt={'Token Logo'}
          src={data.token.logoURI}
          className={'mr-10 h-24 w-24'}
        />
        {data.token.symbol}
      </div>
      <div className={cn('text-20', 'font-weight-500')}>
        {getFiatDisplayValue(data.value, selectedFiatCurrency)}
      </div>
      <div className={cn('!text-white/60', 'font-weight-500')}>
        {buildAmountString(data.amount, data.token)}
      </div>
      <div className={cn('text-white/60', 'font-weight-500')}>
        {getStrategyText(data.strategies.length)}
      </div>
    </div>
  );
};

function getStrategyText(numStrategies: number) {
  const text = numStrategies > 1 ? 'Strategies' : 'Strategy';
  return `${numStrategies} ${text}`;
}
