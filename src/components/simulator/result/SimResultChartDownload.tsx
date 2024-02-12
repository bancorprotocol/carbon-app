import { ReactComponent as IconDownload } from 'assets/icons/download.svg';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { SimulatorData } from 'libs/queries';
import { CsvDataService } from 'libs/csv';
import { cn } from 'utils/helpers';

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
    <button
      className={cn(
        buttonStyles({ variant: 'black' }),
        'flex h-40 w-40 items-center justify-center border-silver p-0'
      )}
      onClick={(e) => {
        downloadCSV({ data, baseSymbol, quoteSymbol, simulationType });
      }}
      aria-label="Download Simulation"
    >
      <IconDownload className="h-18 w-18" />
    </button>
  );
};
