import { PortfolioTokenProps } from 'components/strategies/portfolio/token/PortfolioTokenDesktop';
import {
  buildAmountString,
  buildPairNameByStrategy,
  buildPercentageString,
} from 'components/strategies/portfolio/utils';
import { FC } from 'react';
import {
  CardSection,
  PortfolioMobileCard,
  PortfolioMobileCardLoading,
} from 'components/strategies/portfolio/PortfolioMobileCard';
import { useStore } from 'store';
import { cn, getFiatDisplayValue } from 'utils/helpers';

export const PortfolioTokenMobile: FC<PortfolioTokenProps> = ({
  data,
  isPending,
  selectedToken,
}) => {
  const {
    fiatCurrency: { selectedFiatCurrency },
  } = useStore();

  return (
    <div className={cn('space-y-20')}>
      {isPending
        ? Array.from({ length: 3 }).map((_, i) => (
            <PortfolioMobileCardLoading key={i} />
          ))
        : data.map((value, i) => (
            <PortfolioMobileCard
              key={i}
              index={i}
              gridColsClassName="grid-cols-3"
            >
              <CardSection
                title="ID"
                value={`ID ${value.strategy.idDisplay}`}
              />

              <CardSection
                title="Pair"
                value={buildPairNameByStrategy(value.strategy)}
              />

              <CardSection
                title="Share"
                value={buildPercentageString(value.share)}
              />

              <CardSection
                title="Value"
                value={getFiatDisplayValue(value.value, selectedFiatCurrency)}
              />

              <CardSection
                title="Amount"
                value={buildAmountString(value.amount, selectedToken)}
              />
            </PortfolioMobileCard>
          ))}
    </div>
  );
};
