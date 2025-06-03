import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import {
  buildAmountString,
  buildPercentageString,
} from 'components/strategies/portfolio/utils';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { Options } from 'libs/charts';
import { useMemo } from 'react';
import { useStore } from 'store';
import { getColorByIndex } from 'utils/colorPalettes';
import { getFiatDisplayValue } from 'utils/helpers';

export const usePortfolioAllTokensPieChart = (data: PortfolioData[]) => {
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
          //slicedOffset: 10,
          //borderWidth: 6,
          // borderColor: 'transparent',
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
            '<div class="p-10 text-14 text-white font-weight-500 space-y-12">' +
            '<div class="flex items-center w-[230px] space-x-10">' +
            '<img alt="Token Logo" width="30" height="30" src="' +
            data[this.colorIndex].token.logoURI +
            '" />' +
            '<span class="text-16">' +
            data[this.colorIndex].token.symbol +
            '</span>' +
            '</div>' +
            '<div class="flex justify-between">' +
            '<span class="text-white/60">Strategies</span>' +
            data[this.colorIndex].strategies.length +
            '</div>' +
            '<div class="flex justify-between">' +
            '<span class="text-white/60">Share</span>' +
            buildPercentageString(data[this.colorIndex].share) +
            '</div>' +
            '<div class="flex justify-between">' +
            '<span class="text-white/60">Amount</span>' +
            buildAmountString(
              data[this.colorIndex].amount,
              data[this.colorIndex].token,
            ) +
            '</div>' +
            '<div class="flex justify-between">' +
            '<span class="text-white/60">Value</span>' +
            getFiatDisplayValue(
              data[this.colorIndex].value,
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
            name: item.token.symbol,
            y: item.share.toNumber(),
            color: getColorByIndex(i),
            borderColor: '#161617',
          })),
        },
      ],
    }),
    [belowBreakpoint, data, selectedFiatCurrency],
  );

  return { pieChartOptions };
};
