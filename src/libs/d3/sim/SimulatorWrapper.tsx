import { extent, scaleLinear } from 'd3';
import { D3ChartSimulatorPortfolioOverHodle } from 'libs/d3/charts/simulatorPortfolioOverHodl';
import { D3ChartSimulatorPrice } from 'libs/d3/charts/simulatorPrice';
import { D3ChartProvider } from 'libs/d3/D3ChartProvider';
import { D3ChartSettingsProps } from 'libs/d3/types';
import { useChartDimensions } from 'libs/d3/useChartDimensions';
import { SimulatorData, SimulatorParams, useGetSimulator } from 'libs/queries';
import { useCallback, useEffect, useState } from 'react';

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
  const [wrapperRef, dms] = useChartDimensions(chartSettings);
  const { data: queryData, isLoading, error } = useGetSimulator(mockParams);
  const [data, setData] = useState<SimulatorData[]>([]);

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

  if (error) {
    return <div>error</div>;
  }

  const xScale = scaleLinear()
    .domain(extent(data, (d) => d.date) as [number, number])
    .range([0, dms.boundedWidth]);

  return (
    <>
      <div ref={wrapperRef}>
        <div>{timer}</div>
        {!queryData?.data.length ? (
          <div>no data</div>
        ) : (
          <>
            <D3ChartProvider
              ref={wrapperRef}
              data={{ data, bounds: queryData.bounds }}
              xScale={xScale}
              dms={dms}
            >
              <D3ChartSimulatorPrice />
            </D3ChartProvider>
            <D3ChartSimulatorPortfolioOverHodle
              settings={chartSettings}
              data={{ data, bounds: queryData.bounds }}
            />
          </>
        )}
      </div>

      {/*<D3ChartSimulatorBalance settings={chartSettings} />*/}
    </>
  );
};
