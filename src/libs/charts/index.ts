import HighchartsReact from 'highcharts-react-official';
import type Highcharts from 'highcharts';

export const loadHighchart = async () => {
  const [{ default: Highcharts }, { default: highchartsAccessibility }] =
    await Promise.all([
      import('highcharts'),
      import('highcharts/modules/accessibility'),
    ]);
  highchartsAccessibility(Highcharts);
  return Highcharts;
};

//@ts-ignore
export { HighchartsReact, Highcharts };
export type { Options } from 'highcharts/highcharts';
