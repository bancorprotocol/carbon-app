import { prettifyNumber } from 'utils/helpers';
import { PortfolioTokenData } from './usePortfolioToken';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { Options } from 'libs/charts';
import { getColorByIndex } from 'utils/colorPalettes';

export const usePortfolioTokenPieChart = (data: PortfolioTokenData[]) => {
  const { belowBreakpoint } = useBreakpoints();

  const pieChartOptions: Options = {
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
        slicedOffset: 10,
        borderWidth: 6,
        borderColor: '#161617 !important',
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
      formatter: function () {
        return (
          '<div class="p-10 text-14 text-white !font-weight-500 space-y-12 w-[230px]">' +
          '<div class="flex justify-between">' +
          '<span class="text-white/60">ID</span>' +
          data[this.colorIndex].strategy.idDisplay +
          '</div>' +
          '<div class="flex justify-between">' +
          '<span class="text-white/60">Pair</span>' +
          data[this.colorIndex].strategy.base.symbol +
          '/' +
          data[this.colorIndex].strategy.quote.symbol +
          '</div>' +
          '<div class="flex justify-between">' +
          '<span class="text-white/60">Share</span>' +
          data[this.colorIndex].share.toFixed(2) +
          ' %</div>' +
          '<div class="flex justify-between">' +
          '<span class="text-white/60">Amount</span>' +
          prettifyNumber(data[this.colorIndex].amount) +
          ' ' +
          '????????' +
          '</div>' +
          '<div class="flex justify-between">' +
          '<span class="text-white/60">Value</span>' +
          prettifyNumber(data[this.colorIndex].value) +
          // TODO dont hardcode fiat currency
          ' ????' +
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
          name: '??????',
          y: item.share.toNumber(),
          color: getColorByIndex(i),
          borderColor: '#161617',
        })),
      },
    ],
  };

  return { pieChartOptions };
};
