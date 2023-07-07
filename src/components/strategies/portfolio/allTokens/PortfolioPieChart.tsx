import { Highcharts, HighchartsReact, Options } from 'libs/charts';
import { StrategyPortfolioData } from 'components/strategies/portfolio/useStrategyPortfolio';
import { DATA_TABLE_COLOR_PALETTE } from 'utils/colorPalettes';
import { prettifyNumber } from 'utils/helpers';

export const PortfolioPieChart = ({
  data,
}: {
  data: StrategyPortfolioData[];
}) => {
  const options: Options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      height: 400,
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
          '<div class="p-10 text-14 text-white !font-weight-500 space-y-12">' +
          '<div class="flex items-center w-[230px] space-x-10">' +
          '<img width="30" height="30" src="' +
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
          data[this.colorIndex].share.toFixed(2) +
          ' %</div>' +
          '<div class="flex justify-between">' +
          '<span class="text-white/60">Amount</span>' +
          prettifyNumber(data[this.colorIndex].amount) +
          ' ' +
          data[this.colorIndex].token.symbol +
          '</div>' +
          '<div class="flex justify-between">' +
          '<span class="text-white/60">Value</span>' +
          prettifyNumber(data[this.colorIndex].value) +
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
          name: item.token.symbol,
          y: item.share.toNumber(),
          color: DATA_TABLE_COLOR_PALETTE[i],
          borderColor: '#161617',
        })),
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};
