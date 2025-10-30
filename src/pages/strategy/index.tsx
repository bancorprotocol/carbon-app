import {
  useNavigate,
  useParams,
  useRouter,
  useSearch,
} from '@tanstack/react-router';
import { ActivityProvider } from 'components/activity/ActivityProvider';
import { Page } from 'components/common/page';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { cn } from 'utils/helpers';
import { useGetStrategy } from 'libs/queries';
import { useGetEnrichedStrategies } from 'hooks/useStrategies';
import { StrategyBlockBuySell } from 'components/strategies/overview/strategyBlock/StrategyBlockBuySell';
import { StrategyGraph } from 'components/strategies/overview/strategyBlock/StrategyGraph';
import {
  ManageButtonIcon,
  StrategyBlockManage,
} from 'components/strategies/overview/strategyBlock/StrategyBlockManage';
import { StrategySubtitle } from 'components/strategies/overview/strategyBlock/StrategyBlockHeader';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { NotFound } from 'components/common/NotFound';
import { ActivityLayout } from 'components/activity/ActivityLayout';
import { BackButton } from 'components/common/button/BackButton';
import {
  defaultEnd,
  isGradientStrategy,
  oneYearAgo,
} from 'components/strategies/common/utils';
import config from 'config';
import { StrategyBlockInfo } from 'components/strategies/overview/strategyBlock/StrategyBlockInfo';
import { useActivityQuery } from 'components/activity/useActivityQuery';
import { Radio, RadioGroup } from 'components/common/radio/RadioGroup';
import { StrategyPageSearch } from 'libs/routing/routes/strategy';
import { PairName } from 'components/common/DisplayPair';
import { D3ChartIndicators } from 'components/strategies/common/d3Chart/D3ChartIndicators';
import { D3Drawings } from 'components/strategies/common/d3Chart/drawing/D3Drawings';
import { D3XAxis } from 'components/strategies/common/d3Chart/D3XAxis';
import { D3YAxis } from 'components/strategies/common/d3Chart/D3YAxis';
import { D3ChartMarketPrice } from 'components/strategies/common/d3Chart/D3ChartMarketPrice';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { PairChartHistory } from 'components/strategies/common/PairChartHistory';

export const StrategyPage = () => {
  const { history } = useRouter();
  const { id } = useParams({ from: '/strategy/$id' });
  const navigate = useNavigate({ from: '/strategy/$id' });
  const { chartStart, chartEnd, hideIndicators } = useSearch({
    from: '/strategy/$id',
  });
  const params = { strategyIds: id };
  const query = useGetStrategy(id);
  const { data, isPending } = useGetEnrichedStrategies(query);
  const strategy = data?.[0];
  const { marketPrice } = useMarketPrice({
    base: strategy?.base,
    quote: strategy?.quote,
  });

  const setSearch = (search: Partial<StrategyPageSearch>) => {
    navigate({
      params: (params) => params,
      search: (previous) => ({ ...previous, ...search }),
      resetScroll: false,
      replace: true,
    });
  };

  const showIndicator = (shouldShow: boolean) => {
    setSearch({ hideIndicators: shouldShow });
  };

  const { data: activities } = useActivityQuery({
    strategyIds: id,
    start: chartStart ?? oneYearAgo(),
    end: chartEnd ?? defaultEnd(),
  });

  if (isPending) {
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
  const isNativeChart = config.ui.priceChart === 'native';

  return (
    <Page className="gap-20">
      <header className="flex items-center gap-8">
        <BackButton onClick={() => history.back()} />
        <TokensOverlap tokens={[base, quote]} size={40} />
        <div className="flex-1 flex-col gap-8">
          <h1 className="text-18 font-medium flex gap-8">
            <PairName baseToken={base} quoteToken={quote} />
          </h1>
          <StrategySubtitle
            id={strategy.idDisplay}
            status={strategy.status}
            isGradient={isGradientStrategy(strategy)}
          />
        </div>
        <StrategyBlockManage
          strategy={strategy}
          button={(attr) => <ManageButtonIcon {...attr} />}
        />
      </header>
      <section className="flex justify-center gap-16">
        <article className="@container/strategy surface grid gap-16 rounded-2xl p-24 min-w-330 sm:min-w-350 w-1/4 aspect-[410/425]">
          <StrategyBlockInfo strategy={strategy} />
          <div
            className={cn(
              'bg-main-900/20 rounded-md border-main-800 grid grid-cols-2 grid-rows-[auto_auto] border',
              strategy.status === 'active' ? '' : 'opacity-50',
            )}
          >
            <StrategyBlockBuySell
              strategy={strategy}
              isBuy
              className="border-main-800 border-r-2"
            />
            <StrategyBlockBuySell strategy={strategy} />
            <div className="border-main-800 col-start-1 col-end-3 border-t-2">
              <StrategyGraph strategy={strategy} />
            </div>
          </div>
        </article>
        <article className="surface hidden flex-1 flex-col gap-20 rounded-2xl p-16 md:flex">
          <header className="flex items-center gap-16">
            <h2 className="text-18 font-medium mr-auto">Price Chart</h2>
            {isNativeChart && (
              <div className="flex items-center gap-8">
                <p id="indicator-label">Indicators</p>
                <RadioGroup aria-labelledby="indicator-label">
                  <Radio
                    checked={!hideIndicators}
                    onChange={() => showIndicator(false)}
                  >
                    On
                  </Radio>
                  <Radio
                    checked={hideIndicators}
                    onChange={() => showIndicator(true)}
                  >
                    Off
                  </Radio>
                </RadioGroup>
              </div>
            )}
          </header>
          <PairChartHistory base={base} quote={quote}>
            <D3ChartIndicators
              activities={(!hideIndicators && activities) || []}
            />
            <D3Drawings />
            <D3XAxis />
            {/* @todo(gradient) */}
            {/* <D3ChartToday /> */}
            <D3YAxis />
            <D3ChartMarketPrice marketPrice={marketPrice} />
          </PairChartHistory>
        </article>
      </section>
      <ActivityProvider params={params} url="/strategy/$id">
        <ActivityLayout filters={[]} />
      </ActivityProvider>
    </Page>
  );
};
