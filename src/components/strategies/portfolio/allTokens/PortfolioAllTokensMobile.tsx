import { TokenLogo } from 'components/common/imager/Imager';
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
import { getUsdPrice } from 'utils/helpers';

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
  return (
    <ul className="grid gap-16">
      {isPending
        ? Array.from({ length: 3 }).map((_, i) => (
            <li key={i}>
              <PortfolioMobileCardLoading />
            </li>
          ))
        : data.map((value, i) => (
            <li key={i}>
              <PortfolioMobileCard
                index={i}
                href={getHref(value).href}
                params={getHref(value).params}
                search={getHref(value).search}
              >
                <div className="flex items-center text-18">
                  <TokenLogo token={value.token} size={26} className="mr-8" />
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

                <CardSection title="Value" value={getUsdPrice(value.value)} />
              </PortfolioMobileCard>
            </li>
          ))}
    </ul>
  );
};
