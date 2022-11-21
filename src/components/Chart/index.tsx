import { createRef, useEffect } from 'react';
import {
  ColorType,
  createChart,
  CrosshairMode,
  LineStyle,
  MouseEventParams,
  PriceLineOptions,
} from 'lightweight-charts';

const initialData = [
  { time: '2018-12-22', value: 32.51 },
  { time: '2018-12-23', value: 31.11 },
  { time: '2018-12-24', value: 27.02 },
  { time: '2018-12-25', value: 27.32 },
  { time: '2018-12-26', value: 25.17 },
  { time: '2018-12-27', value: 28.89 },
  { time: '2018-12-28', value: 25.46 },
  { time: '2018-12-29', value: 23.92 },
  { time: '2018-12-30', value: 22.68 },
  { time: '2018-12-31', value: 22.67 },
];

export const ChartComponent = () => {
  const backgroundColor = 'white';
  const lineColor = '#2962FF';
  const textColor = 'black';
  const areaTopColor = '#2962FF';
  const areaBottomColor = 'rgba(41, 98, 255, 0.28)';

  const chartContainerRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (chartContainerRef.current === null) {
      return;
    }

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      crosshair: {
        mode: CrosshairMode.Normal,
      },
    });
    chart.timeScale().fitContent();
    const myClickHandler = (param: MouseEventParams) => {
      if (!param.point) {
        return;
      }

      const barPrice = newSeries.coordinateToPrice(param.point.y);
      if (!barPrice) return;
      const priceLineOptions: PriceLineOptions = {
        price: barPrice,
        color: '#be1238',
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
        axisLabelVisible: true,
        title: 'average price',
        lineVisible: true,
      };
      newSeries.createPriceLine(priceLineOptions);
    };

    chart.subscribeClick(myClickHandler);

    const newSeries = chart.addAreaSeries({
      lineColor,
      topColor: areaTopColor,
      bottomColor: areaBottomColor,
    });
    newSeries.setData(initialData);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      chart.remove();
    };
  }, [
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
    chartContainerRef,
  ]);

  return <div ref={chartContainerRef} />;
};
