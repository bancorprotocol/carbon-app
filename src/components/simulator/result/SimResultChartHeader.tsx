import {
  DatePickerButton,
  DateRangePicker,
  datePickerPresets,
} from 'components/common/datePicker/DateRangePicker';
import { subDays } from 'date-fns';
import { useNavigate } from 'libs/routing';
import { SimulatorType } from 'libs/routing/routes/sim';
import { SimResultChartTabs } from 'components/simulator/result/SimResultChartTabs';
import { SimResultChartDownload } from 'components/simulator/result/SimResultChartDownload';
import { SimulatorData } from 'libs/queries';
import { StrategyInputValues } from 'hooks/useStrategyInput';
import { SimResultChartControls } from 'components/simulator/result/SimResultChartControls';
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { fromUnixUTC } from '../utils';

interface Props {
  data: Array<SimulatorData>;
  showSummary: boolean;
  setShowSummary: Dispatch<SetStateAction<boolean>>;
  state: StrategyInputValues;
  simulationType: SimulatorType;
}

export const datePickerDisabledDays = [
  { after: new Date(), before: subDays(new Date(), 365) },
];

export const SimResultChartHeader = ({
  showSummary,
  setShowSummary,
  data,
  state,
  simulationType,
}: Props) => {
  const startUnix = data[0].date;
  const endUnix = data[data.length - 1].date;

  const navigate = useNavigate();

  const onDatePickerConfirm = useCallback(
    (props: { start?: string; end?: string }) => {
      if (!props.start || !props.end) return;
      navigate({
        from: '/simulate/result',
        to: '/simulate/result',
        search: (search) => ({
          ...search,
          ...props,
        }),
        replace: true,
      });
    },
    [navigate]
  );

  // has to be memorized to work while animation is running
  const DateRangePickerMemo = useMemo(() => {
    return (
      <DateRangePicker
        defaultStart={startUnix}
        defaultEnd={endUnix}
        onConfirm={onDatePickerConfirm}
        button={
          <DatePickerButton
            start={fromUnixUTC(startUnix)}
            end={fromUnixUTC(endUnix)}
          />
        }
        presets={datePickerPresets}
        options={{ disabled: datePickerDisabledDays }}
        required
      />
    );
  }, [endUnix, onDatePickerConfirm, startUnix]);

  return (
    <section className="flex flex-wrap items-center justify-evenly gap-8 py-20 px-24 md:justify-between">
      {DateRangePickerMemo}

      {!showSummary && <SimResultChartControls />}
      <article className="flex flex-wrap items-center justify-center gap-8">
        <SimResultChartTabs
          setShowSummary={setShowSummary}
          showSummary={showSummary}
        />
        <SimResultChartDownload
          data={data}
          baseSymbol={state.baseToken?.symbol ?? ''}
          quoteSymbol={state.quoteToken?.symbol ?? ''}
          simulationType={simulationType ?? ''}
        />
      </article>
    </section>
  );
};
