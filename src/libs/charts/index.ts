import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsAccessibility from 'highcharts/modules/accessibility';

highchartsAccessibility(Highcharts);

//@ts-ignore
export { Highcharts, HighchartsReact };
export type { Options } from 'highcharts/highcharts';
