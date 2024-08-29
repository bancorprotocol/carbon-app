import { LogoImager } from 'components/common/imager/Imager';
import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import {
  buildAmountString,
  buildPercentageString,
} from 'components/strategies/portfolio/utils';
import { GetPortfolioTokenHref } from 'components/strategies/portfolio/types';
import { FC } from 'react';
import {
  CardSection,
  PortfolioMobileCard,
  PortfolioMobileCardLoading,
} from 'components/strategies/portfolio/PortfolioMobileCard';
import { useStore } from 'store';
import { cn, getFiatDisplayValue } from 'utils/helpers';

type Props = {
  data: PortfolioData[];
  isPending: boolean;
  getHref: GetPortfolioTokenHref;
};

export const PortfolioAllTokensMobile: FC<Props> = ({
  data,
  isPending,
  getHref,
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
              href={getHref(value).href}
              params={getHref(value).params}
              search={getHref(value).search}
            >
              <div className={cn('flex', 'items-center', 'text-18')}>
                <LogoImager
                  src={value.token.logoURI}
                  alt="Token Logo"
                  className={cn('w-36', 'h-36', 'mr-10')}
                />
                {value.token.symbol}
              </div>

              <CardSection
                title="Amount"
                value={buildAmountString(value.amount, value.token)}
              />

              <CardSection
                title="Share"
                value={buildPercentageString(value.share)}
              />

              <CardSection
                title="Value"
                value={getFiatDisplayValue(value.value, selectedFiatCurrency)}
              />
            </PortfolioMobileCard>
          ))}
    </div>
  );
};
