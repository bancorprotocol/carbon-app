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
