import { useParams, useRouter } from '@tanstack/react-router';
import { ActivityProvider } from 'components/activity/ActivityProvider';
import { ActivitySection } from 'components/activity/ActivitySection';
import { useActivity } from 'components/activity/useActivity';
import { Page } from 'components/common/page';
import { ReactComponent as IconChevronLeft } from 'assets/icons/chevron-left.svg';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { cn } from 'utils/helpers';
import { useGetUserStrategies } from 'libs/queries';
import { useStrategiesWithFiat } from 'hooks/useStrategies';
import { StrategyBlockRoi } from 'components/strategies/overview/strategyBlock/StrategyBlockRoi';
import { StrategyBlockBudget } from 'components/strategies/overview/strategyBlock/StrategyBlockBudget';
import { StrategyBlockBuySell } from 'components/strategies/overview/strategyBlock/StrategyBlockBuySell';
import { StrategyGraph } from 'components/strategies/overview/strategyBlock/StrategyGraph';
import { StrategyBlockManage } from 'components/strategies/overview/strategyBlock/StrategyBlockManage';
import { StrategySubtitle } from 'components/strategies/overview/strategyBlock/StrategyBlockHeader';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { TradingviewChart } from 'components/tradingviewChart';

export const StrategyPage = () => {
  const query = useActivity();
  const { history } = useRouter();
  const { id } = useParams({ from: '/strategy/$id' });
  const activities = (query.data ?? []).filter((activity) => {
    return activity.strategy.id === id;
  });
  // TODO: change to useGetStrategy
  const user = activities[0]?.strategy.owner;
  const allStrategies = useStrategiesWithFiat(useGetUserStrategies({ user }));
  const strategy = allStrategies.find((strategy) => strategy.id === id);
  if (query.isLoading || !strategy) {
    return (
      <CarbonLogoLoading className="m-80 h-[100px] self-center justify-self-center" />
    );
  }

  const base = strategy.base;
  const quote = strategy.quote;

  return (
    <Page hideTitle={true} className="gap-20">
      <header className="flex items-center gap-8">
        <button
          onClick={() => history.back()}
          className="rounded-full bg-background-900 p-12 hover:bg-background-800"
        >
          <IconChevronLeft className="h-16 w-16" />
        </button>
        <TokensOverlap tokens={[base, quote]} size={40} />
        <div className="flex-1 flex-col gap-8">
          <h1 className="flex gap-8 text-18 font-weight-500">
            <span>{base.symbol}</span>
            <span className="text-white/25">/</span>
            <span>{quote.symbol}</span>
          </h1>
          <StrategySubtitle {...strategy} />
        </div>
        <StrategyBlockManage strategy={strategy} isExplorer={false} />
      </header>
      <section className="flex gap-16">
        <article className="grid w-[400px] grid-cols-2 grid-rows-[auto_auto_auto] gap-16 rounded bg-background-900 p-24">
          <h2 className="col-span-2 text-18 font-weight-500">Strategy Info</h2>
          <StrategyBlockRoi strategy={strategy} />
          <StrategyBlockBudget strategy={strategy} />
          <div
            className={cn(
              'col-start-1 col-end-3 grid grid-cols-2 grid-rows-[auto_auto] rounded-8 border-2 border-background-800',
              strategy.status === 'active' ? '' : 'opacity-50'
            )}
          >
            <StrategyBlockBuySell
              strategy={strategy}
              buy
              className="border-r-2 border-background-800"
            />
            <StrategyBlockBuySell strategy={strategy} />
            <div className="col-start-1 col-end-3 border-t-2 border-background-800">
              <StrategyGraph strategy={strategy} />
            </div>
          </div>
        </article>
        <article className="flex flex-1 flex-col gap-20 rounded bg-background-900 p-16 p-24">
          <h2 className="text-18 font-weight-500">Price graph</h2>
          <TradingviewChart base={base} quote={quote} />
        </article>
      </section>
      <ActivityProvider activities={activities}>
        <ActivitySection filters={[]} />
      </ActivityProvider>
    </Page>
  );
};
