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

// @ts-expect-error Highchart react is namespace and used as a component
export { HighchartsReact, Highcharts };
export type { Options } from 'highcharts/highcharts';
