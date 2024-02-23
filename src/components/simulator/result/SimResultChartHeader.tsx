import {
  DatePickerPreset,
  DateRangePicker,
} from 'components/common/datePicker/DateRangePicker';
import { useNavigate } from 'libs/routing';
import { SimulatorType } from 'libs/routing/routes/sim';
import { SimResultChartTabs } from 'components/simulator/result/SimResultChartTabs';
import { SimResultChartDownload } from 'components/simulator/result/SimResultChartDownload';
import { SimulatorData } from 'libs/queries';
import { StrategyInputValues } from 'hooks/useStrategyInput';
import { SimResultChartControls } from 'components/simulator/result/SimResultChartControls';
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { ReactComponent as CalendarIcon } from 'assets/icons/calendar.svg';

interface Props {
  data: Array<SimulatorData>;
  showSummary: boolean;
  setShowSummary: Dispatch<SetStateAction<boolean>>;
  state: StrategyInputValues;
  simulationType: SimulatorType;
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
});

const datePickerPresets: DatePickerPreset[] = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'Last 365 days', days: 365 },
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
  const startDate = dateFormatter.format(startUnix * 1e3);
  const endDate = dateFormatter.format(endUnix * 1e3);

  const navigate = useNavigate();

  const onDatePickerConfirm = useCallback(
    (props: { start: string; end: string }) => {
      navigate({
        from: '/simulator/result',
        to: '/simulator/result',
        search: (search) => ({
          ...search,
          ...props,
        }),
        replace: true,
      });
    },
    [navigate]
  );

  const DatePickerButton = useMemo(
    () => (
      <>
        <span className="flex h-24 w-24 items-center justify-center rounded-[12px] bg-white/10">
          <CalendarIcon className="h-12 w-12" />
        </span>

        <span className="justify-self-end text-14 text-white/80">
          {startDate} – {endDate}
        </span>
      </>
    ),
    [startDate, endDate]
  );

  return (
    <section className="flex flex-wrap items-center justify-evenly gap-8 py-20 px-24 md:justify-between">
      <DateRangePicker
        defaultStart={startUnix}
        defaultEnd={endUnix}
        onConfirm={onDatePickerConfirm}
        button={DatePickerButton}
        presets={datePickerPresets}
      />

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
