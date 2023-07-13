import { Imager } from 'components/common/imager/Imager';
import { PortfolioData } from 'components/strategies/portfolio/usePortfolio';
import { FC } from 'react';
import {
  CardSection,
  PortfolioMobileCard,
} from 'components/strategies/portfolio/PortfolioMobileCard';
import { cn, prettifyNumber } from 'utils/helpers';

type Props = {
  data: PortfolioData[];
  isLoading: boolean;
};

// TODO add loading animation
export const PortfolioAllTokensMobile: FC<Props> = ({ data, isLoading }) => {
  return (
    <div className={cn('space-y-20')}>
      {data.map((value, i) => (
        <PortfolioMobileCard
          key={i}
          index={i}
          // TODO remove hardcoded href
          href={`/portfolio/${value.token.address}`}
        >
          <div className={cn('flex', 'items-center', 'text-18')}>
            <Imager
              src={value.token.logoURI}
              alt={'Token Logo'}
              className={cn('w-36', 'h-36', 'rounded-full', 'mr-10')}
            />
            {value.token.symbol}
          </div>

          <CardSection
            title={'Amount'}
            value={`${prettifyNumber(value.amount)} ${value.token.symbol}`}
          />

          <CardSection title={'Share'} value={`${value.share.toFixed(2)} %`} />

          <CardSection
            title={'Value'}
            // TODO dont hardcode fiat currency
            value={`$${prettifyNumber(value.value)} USD`}
          />
        </PortfolioMobileCard>
      ))}
    </div>
  );
};
