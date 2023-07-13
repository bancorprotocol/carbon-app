import { PortfolioTokenProps } from 'components/strategies/portfolio/token/PortfolioTokenDesktop';
import { FC } from 'react';
import {
  CardSection,
  PortfolioMobileCard,
} from 'components/strategies/portfolio/PortfolioMobileCard';
import { cn, prettifyNumber } from 'utils/helpers';

// TODO add loading animation
export const PortfolioTokenMobile: FC<PortfolioTokenProps> = ({
  data,
  isLoading,
}) => {
  return (
    <div className={cn('space-y-20')}>
      {data.map((value, i) => (
        <PortfolioMobileCard key={i} index={i}>
          <CardSection
            title={'Amount'}
            value={`${prettifyNumber(value.amount)}`}
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
