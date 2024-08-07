import { Outlet, useSearch } from '@tanstack/react-router';
import { ActivityProvider } from 'components/activity/ActivityProvider';
import { ActivitySection } from 'components/activity/ActivitySection';
import { StrategyCreateFirst } from 'components/strategies/overview/StrategyCreateFirst';
import { TradeExplorerTab } from 'components/trade/TradeExplorerTabs';

const url = '/trade/activity/type';
export const TradeActivity = () => {
  const { base, quote } = useSearch({ from: url });
  const params = { token0: base, token1: quote };
  return (
    <>
      <Outlet />
      <section className="col-span-2 grid gap-20">
        <TradeExplorerTab current="activity" />
        <ActivityProvider params={params} empty={<StrategyCreateFirst />}>
          <ActivitySection filters={['ids']} />
        </ActivityProvider>
      </section>
    </>
  );
};
