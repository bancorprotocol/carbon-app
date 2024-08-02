import { Outlet } from '@tanstack/react-router';
import { TradeExplorerTab } from 'components/trade/TradeExplorerTabs';

export const TradePortfolio = () => {
  return (
    <>
      <Outlet />
      <section aria-label="Portfolio" className="col-span-2 grid gap-20">
        <TradeExplorerTab current="portfolio" />
        <div>Portfolio</div>
      </section>
    </>
  );
};
