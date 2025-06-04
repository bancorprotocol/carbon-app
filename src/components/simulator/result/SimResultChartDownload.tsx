import { ReactComponent as IconDownload } from 'assets/icons/download.svg';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { SimulatorData } from 'libs/queries';
import { CsvDataService } from 'libs/csv';
import { cn } from 'utils/helpers';
import { Tooltip } from 'components/common/tooltip/Tooltip';

const downloadCSV = ({
  data,
  baseSymbol,
  quoteSymbol,
  simulationType,
}: Props) => {
  const csvOutput = data.map((item) => ({
    ...item,
    date: new Date(item.date * 1e3),
  }));
  const fileName = `${baseSymbol}_${quoteSymbol}_${simulationType}`;
  CsvDataService.exportToCsv(fileName, csvOutput);
};
interface Props {
  data: Array<SimulatorData>;
  baseSymbol: string;
  quoteSymbol: string;
  simulationType: string;
}

export const SimResultChartDownload = ({
  data,
  baseSymbol,
  quoteSymbol,
  simulationType,
}: Props) => {
  return (
    <Tooltip
      damping={20}
      stiffness={200}
      element="Download a csv file with full breakdown of the simulation data"
    >
      <button
        className={cn(
          buttonStyles({ variant: 'black' }),
          'border-background-900 flex size-40 items-center justify-center p-0',
        )}
        onClick={() => {
          downloadCSV({ data, baseSymbol, quoteSymbol, simulationType });
        }}
        aria-label="Download Simulation"
      >
        <IconDownload className="size-18" />
      </button>
    </Tooltip>
  );
};
