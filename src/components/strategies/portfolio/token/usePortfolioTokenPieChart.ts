import {
  buildAmountString,
  buildPairNameByStrategy,
  buildPercentageString,
} from 'components/strategies/portfolio/utils';
import { Token } from 'libs/tokens';
import { useMemo } from 'react';
import { useStore } from 'store';
import { getFiatDisplayValue } from 'utils/helpers';
import { PortfolioTokenData } from './usePortfolioToken';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { Options } from 'libs/charts';
import { getColorByIndex } from 'utils/colorPalettes';

export const usePortfolioTokenPieChart = (
  data: PortfolioTokenData[],
  token: Token,
) => {
  const { belowBreakpoint } = useBreakpoints();

  const {
    fiatCurrency: { selectedFiatCurrency },
  } = useStore();

  const pieChartOptions: Options = useMemo(
    () => ({
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        height: belowBreakpoint('md') ? '100%' : 400,
      },
      title: {
        text: '',
      },
      plotOptions: {
        pie: {
          // slicedOffset: 10,
          // borderWidth: 6,
          // borderColor: '#161617 !important',
        },
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        borderRadius: 12,
        backgroundColor: '#212123',
        borderWidth: 0,
        useHTML: true,
        style: { fontFamily: 'Carbon-Text' },
        formatter: function () {
          return (
            '<div class="p-10 text-14 text-white font-weight-500 space-y-12 w-[230px]">' +
            '<div class="flex justify-between">' +
            '<span class="text-white/60">ID</span>' +
            data[this.point.index].strategy.idDisplay +
            '</div>' +
            '<div class="flex justify-between">' +
            '<span class="text-white/60">Pair</span>' +
            buildPairNameByStrategy(data[this.point.index].strategy) +
            '</div>' +
            '<div class="flex justify-between">' +
            '<span class="text-white/60">Share</span>' +
            buildPercentageString(data[this.point.index].share) +
            '</div>' +
            '<div class="flex justify-between">' +
            '<span class="text-white/60">Amount</span>' +
            buildAmountString(data[this.point.index].amount, token) +
            '</div>' +
            '<div class="flex justify-between">' +
            '<span class="text-white/60">Value</span>' +
            getFiatDisplayValue(
              data[this.point.index].value,
              selectedFiatCurrency,
            ) +
            '</div>' +
            '</div>'
          );
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Share',
          size: '80%',
          innerSize: '80%',
          dataLabels: {
            enabled: false,
          },
          data: data.map((item, i) => ({
            name: item.strategy.idDisplay,
            y: item.share.toNumber(),
            color: getColorByIndex(i),
            borderColor: '#161617',
            index: i,
          })),
        },
      ],
    }),
    [belowBreakpoint, data, selectedFiatCurrency, token],
  );

  return { pieChartOptions };
};
