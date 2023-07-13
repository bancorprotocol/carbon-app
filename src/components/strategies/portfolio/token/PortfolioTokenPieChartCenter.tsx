import { Imager } from 'components/common/imager/Imager';
import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { FC } from 'react';
import { cn, prettifyNumber } from 'utils/helpers';

type Props = {
  data?: PortfolioData;
};

export const PortfolioTokenPieChartCenter: FC<Props> = ({ data }) => {
  // TODO handle error state
  if (!data) return null;

  return (
    <div className={cn('flex', 'flex-col', 'items-center', 'space-y-6')}>
      <div className={cn('flex', 'items-center', 'font-weight-500', 'text-18')}>
        <Imager
          alt={'Token Logo'}
          src={data.token.logoURI}
          className={'h-24 w-24 me-10'}
        />
        {data.token.symbol}
      </div>
      <div className={cn('text-24', 'font-weight-500')}>
        ${prettifyNumber(data.value || 0)} ???
      </div>
      <div className={cn('text-white/60', 'font-weight-500')}>
        {data.strategies.length} Strategies
      </div>
    </div>
  );
};
