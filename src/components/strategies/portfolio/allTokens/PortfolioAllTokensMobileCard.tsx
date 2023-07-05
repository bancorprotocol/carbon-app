import { StrategyPortfolioData } from 'components/strategies/portfolio/useStrategyPortfolio';
import { FC } from 'react';
import { cn, prettifyNumber } from 'utils/helpers';
import { DATA_TABLE_COLOR_PALETTE } from 'utils/colorPalettes';
import { Imager } from 'components/common/imager/Imager';

type Props = {
  index: number;
  data: StrategyPortfolioData;
};

export const PortfolioAllTokensMobileCard: FC<Props> = ({ index, data }) => {
  return (
    <div
      className={cn(
        'flex',
        'items-center',
        'bg-silver',
        'h-[120px]',
        'rounded-10',
        'space-x-20'
      )}
    >
      <div
        className={cn('w-4', 'h-88', 'rounded-r-2')}
        style={{ backgroundColor: DATA_TABLE_COLOR_PALETTE[index] }}
      />

      <div
        className={cn(
          'grid',
          'grid-cols-2',
          'gap-10',
          'w-full',
          'font-weight-500'
        )}
      >
        <div className={cn('flex', 'items-center', 'text-18')}>
          <Imager
            src={data.token.logoURI}
            alt={'Token Logo'}
            className={cn('w-36', 'h-36', 'rounded-full', 'mr-10')}
          />
          {data.token.symbol}
        </div>

        <CardSection
          title={'Amount'}
          value={`${prettifyNumber(data.amount)} ${data.token.symbol}`}
        />

        <CardSection title={'Share'} value={`${data.share.toFixed(2)} %`} />

        <CardSection
          title={'Value'}
          // TODO dont hardcode fiat currency
          value={`$${prettifyNumber(data.value)} USD`}
        />
      </div>
    </div>
  );
};

const CardSection: FC<{ title: string; value: string }> = ({
  title,
  value,
}) => {
  return (
    <div>
      <div className={cn('!text-12', 'text-white/60')}>{title}</div>
      <div>{value}</div>
    </div>
  );
};
