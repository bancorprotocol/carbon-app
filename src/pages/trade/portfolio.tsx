import { Outlet, useNavigate, useSearch } from '@tanstack/react-router';
import { Row } from '@tanstack/react-table';
import { NoStrategies } from 'components/strategies/common/NoStrategies';
import {
  PortfolioAllTokens,
  PortfolioToken,
} from 'components/strategies/portfolio';
import { GetPortfolioTokenHref } from 'components/strategies/portfolio/types';
import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { TradeExplorerTab } from 'components/trade/TradeExplorerTabs';
import { useStrategyCtx } from 'hooks/useStrategies';
import { TradePortfolioSearch } from 'libs/routing/routes/trade';

export const TradePortfolio = () => {
  return (
    <>
      <Outlet />
      <section
        aria-labelledby="portfolio-tab"
        className="col-span-2 mx-auto grid w-full max-w-[1220px] gap-20"
      >
        <TradeExplorerTab current="portfolio" />
        <PortfolioView />
      </section>
    </>
  );
};

export const PortfolioView = () => {
  const navigate = useNavigate();
  const { strategies, isPending } = useStrategyCtx();
  const { token } = useSearch({ strict: false }) as TradePortfolioSearch;
  const getPortfolioTokenHref: GetPortfolioTokenHref = (row) => ({
    href: window.location.pathname as any,
    params: {},
    search: (s) => ({ ...s, token: row.token.address }),
  });
  const onRowClick = (row: Row<PortfolioData>) =>
    navigate({
      to: window.location.pathname as any,
      params: {},
      search: (s) => ({ ...s, token: row.original.token.address }),
      resetScroll: false,
    });

  if (!isPending && !strategies.length) return <NoStrategies />;
  if (token) {
    return (
      <PortfolioToken
        strategies={strategies}
        isPending={isPending}
        address={token}
        backLinkHref={window.location.pathname as any}
        backLinkHrefParams={{}}
      />
    );
  }
  return (
    <PortfolioAllTokens
      strategies={strategies}
      isPending={isPending}
      getHref={getPortfolioTokenHref}
      onRowClick={onRowClick}
    />
  );
};
