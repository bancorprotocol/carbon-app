import { extent, scaleLinear } from 'd3';
import { D3ChartLine } from 'libs/d3/charts/D3ChartLine';
import { D3ChartSimulatorBalance } from 'libs/d3/charts/simulatorBalance/SimulatorBalance';
import { D3ChartSimulatorPrice } from 'libs/d3/charts/simulatorPrice';
import { D3ChartProvider } from 'libs/d3/D3ChartProvider';
import { SimInput } from 'libs/d3/sim/SimInput';
import { D3ChartSettingsProps } from 'libs/d3/types';
import { useChartDimensions } from 'libs/d3/useChartDimensions';
import {
  SimulatorData,
  SimulatorParams,
  SimulatorReturn,
  useMutateSimulator,
} from 'libs/queries';
import { ReactNode, useCallback, useEffect, useState } from 'react';

const mockParams: SimulatorParams = {
  token0: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
  token1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  start: 1672491600,
  end: 1701262800,
  startingPortfolioValue: 123546, // 10 BTC * 18,67 + 20 ETH
  highRangeHighPriceCash: 0.619452,
  highRangeLowPriceCash: 0.522466,
  lowRangeHighPriceCash: 0.44,
  lowRangeLowPriceCash: 0.3275,
  startRateHighRange: 0.522466,
  startRateLowRange: 0.44,
  cashProportion: 100, //
  riskProportion: 1,
  networkFee: 0.00142331163646665,
};

const chartSettings: D3ChartSettingsProps = {
  width: 0,
  height: 500,
  marginTop: 20,
  marginBottom: 40,
  marginLeft: 50,
  marginRight: 50,
};

let init2 = false;

let i = 0;

const times: number[] = [];

export const SimulatorWrapper = () => {
  // const { data: queryData, isLoading, error } = useGetSimulator(mockParams);
  const [data, setData] = useState<SimulatorData[]>([]);
  const {
    mutateAsync,
    isLoading,
    error,
    data: queryData,
  } = useMutateSimulator();

  const [timer, setTimer] = useState('');

  const startAnimation = useCallback(() => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);

    setTimer(`${times.length} fps`);

    const steps = 1;
    const startSlice = steps * i;
    const endSlice = startSlice + steps;

    if (!queryData) return;

    setData((prev) => [...prev, ...queryData.data.slice(startSlice, endSlice)]);
    i++;
    if (endSlice < queryData.data.length - 1) {
      requestAnimationFrame(startAnimation);
    } else {
      console.log('ended');
      init2 = false;
    }
  }, [queryData]);

  useEffect(() => {
    if (init2) return;
    if (!queryData) return;
    init2 = true;
    setData([]);
    setTimer('');
    startAnimation();
  }, [startAnimation, queryData]);

  // if (isLoading) {
  //   return <div>error</div>;
  // }

  const simData: SimulatorReturn | undefined = queryData && {
    data,
    bounds: queryData.bounds,
  };

  return (
    <>
      <div>{timer}</div>

      <SimInput mutate={mutateAsync} />

      {error && <div>error</div>}

      {queryData && (
        <div className={'grid grid-cols-1 gap-20'}>
          <h2>Price in Quote</h2>
          <SimChartWrapper
            isLoading={isLoading}
            data={simData}
            settings={chartSettings}
          >
            <D3ChartSimulatorPrice />
          </SimChartWrapper>

          <h2>Carbon Strategy Over Hodl Quotient (in %)</h2>
          <SimChartWrapper
            isLoading={isLoading}
            data={simData}
            settings={chartSettings}
          >
            <D3ChartLine accessorKey={'portfolioOverHodl'} />
          </SimChartWrapper>

          <h2>Total Carbon Strategy Value (in QUOTE)</h2>
          <SimChartWrapper
            isLoading={isLoading}
            data={simData}
            settings={chartSettings}
          >
            <D3ChartLine accessorKey={'portfolioValue'} />
          </SimChartWrapper>

          <h2>Budget BASE</h2>
          <SimChartWrapper
            isLoading={isLoading}
            data={simData}
            settings={chartSettings}
          >
            <D3ChartLine accessorKey={'balanceRISK'} />
          </SimChartWrapper>

          <h2>Budget QUOTE</h2>
          <SimChartWrapper
            isLoading={isLoading}
            data={simData}
            settings={chartSettings}
          >
            <D3ChartLine accessorKey={'balanceCASH'} />
          </SimChartWrapper>

          <h2>Balance change</h2>
          <SimChartWrapper
            isLoading={isLoading}
            data={simData}
            settings={chartSettings}
          >
            <D3ChartSimulatorBalance />
          </SimChartWrapper>
        </div>
      )}
    </>
  );
};

const SimChartWrapper = ({
  children,
  isLoading,
  data,
  settings,
}: {
  children: ReactNode;
  isLoading: boolean;
  data?: SimulatorReturn;
  settings: D3ChartSettingsProps;
}) => {
  const [ref, dms] = useChartDimensions(settings);
  const dataset = data?.data || [];

  const xScale = scaleLinear()
    .domain(extent(dataset, (d) => d.date) as [number, number])
    .range([0, dms.boundedWidth]);

  return (
    <div ref={ref} className={'bg-white text-black'}>
      {isLoading || !data ? (
        <div>loading</div>
      ) : (
        <D3ChartProvider data={data} xScale={xScale} dms={dms}>
          {children}
        </D3ChartProvider>
      )}
    </div>
  );
};
