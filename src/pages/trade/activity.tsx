import { Outlet, useSearch } from '@tanstack/react-router';
import { ActivityProvider } from 'components/activity/ActivityProvider';
import { ActivitySection } from 'components/activity/ActivitySection';
import { StrategyCreateFirst } from 'components/strategies/overview/StrategyCreateFirst';

const url = '/trade/activity';
export const TradeActivity = () => {
  const { base, quote } = useSearch({ from: url });
  const params = { token0: base, token1: quote };
  return (
    <>
      <Outlet />
      <section className="col-span-2">
        <ActivityProvider params={params} empty={<StrategyCreateFirst />}>
          <ActivitySection filters={['ids']} />
        </ActivityProvider>
      </section>
    </>
  );
};
