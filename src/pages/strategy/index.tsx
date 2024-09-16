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
import { useStrategiesWithFiat } from 'hooks/useStrategies';
import { StrategyBlockBuySell } from 'components/strategies/overview/strategyBlock/StrategyBlockBuySell';
import { StrategyGraph } from 'components/strategies/overview/strategyBlock/StrategyGraph';
import {
  ManageButton,
  StrategyBlockManage,
} from 'components/strategies/overview/strategyBlock/StrategyBlockManage';
import { StrategySubtitle } from 'components/strategies/overview/strategyBlock/StrategyBlockHeader';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { NotFound } from 'components/common/NotFound';
import { ActivityLayout } from 'components/activity/ActivityLayout';
import { BackButton } from 'components/common/BackButton';
import { StrategyChartHistory } from 'components/strategies/common/StrategyChartHistory';
import {
  defaultEndDate,
  defaultStartDate,
  emptyOrder,
} from 'components/strategies/common/utils';
import { fromUnixUTC, toUnixUTC } from 'components/simulator/utils';
import { datePickerDisabledDays } from 'components/simulator/result/SimResultChartHeader';
import {
  DateRangePicker,
  datePickerPresets,
} from 'components/common/datePicker/DateRangePicker';
import config from 'config';
import { StrategyBlockInfo } from 'components/strategies/overview/strategyBlock/StrategyBlockInfo';
import { useActivityQuery } from 'components/activity/useActivityQuery';
import { Radio, RadioGroup } from 'components/common/radio/RadioGroup';

export const StrategyPage = () => {
  const { history } = useRouter();
  const { id } = useParams({ from: '/strategy/$id' });
  const navigate = useNavigate({ from: '/strategy/$id' });
  const { priceStart, priceEnd, hideIndicators } = useSearch({
    from: '/strategy/$id',
  });
  const params = { strategyIds: id };
  const query = useGetStrategy(id);
  const [strategy] = useStrategiesWithFiat(query);

  const showIndicator = (shouldShow: boolean) => {
    navigate({
      params: (params) => params,
      search: (previous) => ({
        ...previous,
        hideIndicators: shouldShow,
      }),
      resetScroll: false,
      replace: true,
    });
  };

  const onDatePickerConfirm = (props: { start?: Date; end?: Date }) => {
    const { start, end } = props;
    if (!start || !end) return;
    navigate({
      params: (params) => params,
      search: (previous) => ({
        ...previous,
        priceStart: toUnixUTC(start),
        priceEnd: toUnixUTC(end),
      }),
      resetScroll: false,
      replace: true,
    });
  };

  const { data: activities } = useActivityQuery({
    strategyIds: id,
    start: priceStart?.toString() ?? toUnixUTC(defaultStartDate()),
    end: priceEnd?.toString() ?? toUnixUTC(defaultEndDate()),
  });

  if (query.isPending) {
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
  const showStrategyRoi = config.showStrategyRoi;
  const isNativeChart = config.ui.priceChart === 'native';

  return (
    <Page hideTitle={true} className="gap-20">
      <header className="flex items-center gap-8">
        <BackButton onClick={() => history.back()} />
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
          <StrategyBlockInfo
            strategy={strategy}
            showStrategyRoi={showStrategyRoi}
          />
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
          <header className="flex items-center gap-16">
            <h2 className="text-18 font-weight-500 mr-auto">Price Chart</h2>
            {isNativeChart && (
              <>
                <DateRangePicker
                  defaultStart={defaultStartDate()}
                  defaultEnd={defaultEndDate()}
                  start={fromUnixUTC(priceStart)}
                  end={fromUnixUTC(priceEnd)}
                  onConfirm={onDatePickerConfirm}
                  presets={datePickerPresets}
                  options={{
                    disabled: datePickerDisabledDays,
                  }}
                  required
                />
                <p id="indicator-label">Indicator</p>
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
              </>
            )}
          </header>
          <StrategyChartHistory
            type="market"
            base={base}
            quote={quote}
            order0={emptyOrder()}
            order1={emptyOrder()}
            activities={(!hideIndicators && activities) || []}
          />
        </article>
      </section>
      <ActivityProvider params={params}>
        <ActivityLayout filters={[]} />
      </ActivityProvider>
    </Page>
  );
};
