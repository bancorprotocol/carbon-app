import { extent, scaleLinear } from 'd3';
import { D3ChartSimulatorPrice } from 'libs/d3/charts/simulatorPrice';
import { D3ChartProvider } from 'libs/d3/D3ChartProvider';
import { D3ChartSettingsProps } from 'libs/d3/types';
import { useChartDimensions } from 'libs/d3/useChartDimensions';
import { SimulatorData, SimulatorParams, useGetSimulator } from 'libs/queries';
import { useCallback, useEffect, useState } from 'react';

const mockParams: SimulatorParams = {
  token0: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  token1: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
  start: 1690813173,
  end: 1702349173,
  startingPortfolioValue: 100,
  highRangeHighPriceCash: 0.4,
  highRangeLowPriceCash: 0.3,
  lowRangeHighPriceCash: 0.2,
  lowRangeLowPriceCash: 0.1,
  startRateHighRange: 0.3,
  startRateLowRange: 0.1,
  cashProportion: 0,
  riskProportion: 100,
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
          <D3ChartProvider
            ref={wrapperRef}
            data={{ data, bounds: queryData.bounds }}
            xScale={xScale}
            dms={dms}
          >
            <D3ChartSimulatorPrice />
          </D3ChartProvider>
        )}
      </div>

      {/*<D3ChartSimulatorPortfolioOverHodle*/}
      {/*  settings={chartSettings}*/}
      {/*/>*/}

      {/*<D3ChartSimulatorBalance settings={chartSettings} />*/}
    </>
  );
};
