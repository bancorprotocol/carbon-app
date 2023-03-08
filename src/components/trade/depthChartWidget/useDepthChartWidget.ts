import BigNumber from 'bignumber.js';
import { Options } from 'libs/charts';
import { OrderRow, useGetOrderBook } from 'libs/queries';
import { orderBookConfig } from 'libs/queries/sdk/orderBook';
import { useOrderBookWidget } from '../orderWidget/useOrderBookWidget';

export const useDepthChartWidget = (base?: string, quote?: string) => {
  const { data } = useOrderBookWidget(base, quote);
  const { data: orderBookData } = useGetOrderBook(base, quote);
  const { step } = orderBookData || {};

  const getOrders = (orders?: OrderRow[], buy?: boolean) => {
    const res = [...(orders || [])].map(({ rate, amount }) => {
      return [+rate < 0 ? 0 : +rate, +amount];
    });

    if (res.length > 0) {
      return res;
    }

    let rate;
    return new Array(orderBookConfig.buckets.depthChart).fill(0).map((_, i) => {
      rate = new BigNumber(+data?.middleRate)?.[buy ? 'minus' : 'plus'](
        step?.times(i) || 0
      );

      return [+rate, 0];
    });
  };

  const getOptions = (
    bidsData?: number[][],
    asksData?: number[][],
    baseTokenSymbol?: string
  ): Options => {
    const left = bidsData?.[bidsData.length - 1]?.[0] || 0;
    const right = asksData?.[asksData.length - 1]?.[0] || 0;
    const xMiddle =
      left > 0 && right > 0 ? (right + left) / 2 : +data.middleRate;

    return {
      chart: {
        type: 'area',
        backgroundColor: '#000000',
        borderColor: '#000000',
      },
      credits: {
        enabled: false,
      },
      title: {
        text: ' ',
      },
      xAxis: {
        minPadding: 0,
        maxPadding: 0,
        plotLines: [
          {
            color: 'rgba(255, 255, 255, 0.25)',
            value: xMiddle,
            width: 1.5,
            label: {
              text: ' ',
              rotation: 90,
            },
          },
        ],
        title: {},
        tickWidth: 0,
        lineWidth: 0,
        labels: {
          style: {
            color: 'rgba(255, 255, 255, 0.6)',
          },
        },
        crosshair: {
          color: 'rgba(255, 255, 255, 0.25)',
          width: 1,
          dashStyle: 'Dash',
        },
      },
      yAxis: [
        {
          lineWidth: 0,
          gridLineWidth: 0,
          title: {
            text: ' ',
          },
          tickWidth: 0,
          tickLength: 5,
          tickPosition: 'inside',
          labels: {
            x: 50,
            enabled: false,
          },
          crosshair: {
            color: 'rgba(255, 255, 255, 0.25)',
            width: 1,
            dashStyle: 'Dash',
          },
        },
        {
          opposite: true,
          linkedTo: 0,
          lineWidth: 0,
          gridLineWidth: 0,
          title: {
            text: ' ',
          },
          tickWidth: 0,
          tickLength: 5,
          tickPosition: 'inside',
          labels: {
            style: {
              color: 'rgba(255, 255, 255, 0.6)',
            },
          },
        },
      ],
      legend: {
        enabled: false,
      },
      plotOptions: {
        area: {
          fillOpacity: 0.2,
          lineWidth: 1,
          step: 'center',
        },
        series: {
          states: {
            inactive: {
              opacity: 0.7,
            },
          },
        },
      },
      tooltip: {
        headerFormat: ' ',
        pointFormat: `${
          baseTokenSymbol ? baseTokenSymbol : ''
        } amount: {point.y}<br/>Price: {point.x}`,
        valueDecimals: 2,
        borderRadius: 12,
        backgroundColor: '#212123',
        borderWidth: 0,
        style: {
          color: 'white',
        },
      },
      series: [
        {
          type: 'area',
          name: 'Asks',
          data: asksData,
          color: 'rgba(216, 99, 113, 0.8)',
          marker: {
            enabled: false,
          },
        },
        {
          type: 'area',
          name: 'Bids',
          data: bidsData,
          color: 'rgba(0, 181, 120, 0.8)',
          marker: {
            enabled: false,
          },
        },
      ],
    };
  };

  return {
    buyOrders: getOrders(data?.buy, true),
    sellOrders: getOrders(data?.sell),
    getOptions,
    noSellOrders: data.sell.length === 0,
    noBuyOrders: data.buy.length === 0,
  };
};
