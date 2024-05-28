import { useParams, useRouter } from '@tanstack/react-router';
import { ActivityProvider } from 'components/activity/ActivityProvider';
import { ActivitySection } from 'components/activity/ActivitySection';
import { Page } from 'components/common/page';
import { ReactComponent as IconChevronLeft } from 'assets/icons/chevron-left.svg';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { cn } from 'utils/helpers';
import { useGetStrategy } from 'libs/queries';
import { useStrategiesWithFiat } from 'hooks/useStrategies';
import { StrategyBlockRoi } from 'components/strategies/overview/strategyBlock/StrategyBlockRoi';
import { StrategyBlockBudget } from 'components/strategies/overview/strategyBlock/StrategyBlockBudget';
import { StrategyBlockBuySell } from 'components/strategies/overview/strategyBlock/StrategyBlockBuySell';
import { StrategyGraph } from 'components/strategies/overview/strategyBlock/StrategyGraph';
import {
  ManageButton,
  StrategyBlockManage,
} from 'components/strategies/overview/strategyBlock/StrategyBlockManage';
import { StrategySubtitle } from 'components/strategies/overview/strategyBlock/StrategyBlockHeader';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { TradingviewChart } from 'components/tradingviewChart';
import { NotFound } from 'components/common/NotFound';

export const StrategyPage = () => {
  const { history } = useRouter();
  const { id } = useParams({ from: '/strategy/$id' });
  const query = useGetStrategy(id);
  const [strategy] = useStrategiesWithFiat(query);

  if (query.isLoading) {
    return (
      <Page>
        <CarbonLogoLoading className="m-80 h-[100px] self-center justify-self-center" />
      </Page>
    );
  }
  if (!strategy) {
    return (
      <Page>
        <NotFound
          variant="error"
          title="Strategy not found"
          text="The strategy you are looking for does not exist or has been deleted."
          bordered
          showBackButton
        />
      </Page>
    );
  }
  const base = strategy.base;
  const quote = strategy.quote;

  return (
    <Page hideTitle={true} className="gap-20">
      <header className="flex items-center gap-8">
        <button
          onClick={() => history.back()}
          className="bg-background-900 hover:bg-background-800 rounded-full p-12"
        >
          <IconChevronLeft className="size-16" />
        </button>
        <TokensOverlap tokens={[base, quote]} size={40} />
        <div className="flex-1 flex-col gap-8">
          <h1 className="text-18 font-weight-500 flex gap-8">
            <span>{base.symbol}</span>
            <span className="text-white/25">/</span>
            <span>{quote.symbol}</span>
          </h1>
          <StrategySubtitle {...strategy} />
        </div>
        <StrategyBlockManage
          strategy={strategy}
          button={(attr) => <ManageButton {...attr} />}
        />
      </header>
      <section className="flex flex-col gap-16 md:flex-row">
        <article className="bg-background-900 grid grid-cols-2 grid-rows-[auto_auto_auto] gap-16 rounded p-24 md:w-[400px]">
          <h2 className="text-18 font-weight-500 col-span-2">Strategy Info</h2>
          <StrategyBlockRoi strategy={strategy} />
          <StrategyBlockBudget strategy={strategy} />
          <div
            className={cn(
              'rounded-8 border-background-800 col-start-1 col-end-3 grid grid-cols-2 grid-rows-[auto_auto] border-2',
              strategy.status === 'active' ? '' : 'opacity-50'
            )}
          >
            <StrategyBlockBuySell
              strategy={strategy}
              buy
              className="border-background-800 border-r-2"
            />
            <StrategyBlockBuySell strategy={strategy} />
            <div className="border-background-800 col-start-1 col-end-3 border-t-2">
              <StrategyGraph strategy={strategy} />
            </div>
          </div>
        </article>
        <article className="bg-background-900 hidden flex-1 flex-col gap-20 rounded p-16 md:flex">
          <h2 className="text-18 font-weight-500">Price graph</h2>
          <TradingviewChart base={base} quote={quote} />
        </article>
      </section>
      <ActivityProvider params={{ strategyIds: id }}>
        <ActivitySection filters={[]} />
      </ActivityProvider>
    </Page>
  );
};
