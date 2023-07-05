import { createColumnHelper, Table } from 'libs/table';
import {
  StrategyPortfolioData,
  useStrategyPortfolio,
} from 'components/strategies/portfolio';
import { cn, prettifyNumber } from 'utils/helpers';
import { CellContext } from '@tanstack/react-table';
import { Token } from 'libs/tokens';
import { Imager } from 'components/common/imager/Imager';
import { Page } from 'components/common/page';

const colorPalette = ['#1AB99B', '#F0C514', '#81CCB8'];

const columnHelper = createColumnHelper<StrategyPortfolioData>();

const CellToken = (info: CellContext<StrategyPortfolioData, Token>) => {
  const i = info.table.getSortedRowModel().flatRows.indexOf(info.row);
  const { symbol, logoURI } = info.getValue();

  return (
    <div className={cn('flex', 'items-center', 'space-s-16')}>
      <div
        className={cn('h-32', 'w-4', 'bg-blue', 'rounded-r-2')}
        style={{
          backgroundColor: colorPalette[i],
        }}
      />
      <Imager
        alt={'Token Logo'}
        src={logoURI}
        className={'h-32 w-32 rounded-full'}
      />
      <div>{symbol}</div>
    </div>
  );
};

const tableColumns = [
  columnHelper.accessor('token', {
    header: () => <span className={cn('ps-20')}>Token</span>,
    cell: CellToken,
  }),
  columnHelper.accessor('share', {
    header: 'Share',
    cell: (info) => `${info.getValue().toFixed(2)} %`,
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: (info) =>
      `${prettifyNumber(info.getValue())} ${info.row.original.token.symbol}`,
  }),
  columnHelper.accessor('value', {
    header: 'Value',
    // TODO dont hardcode fiat currency
    cell: (info) => `$${prettifyNumber(info.getValue())} USD`,
  }),
  columnHelper.accessor('strategies', {
    header: 'Strategies',
    cell: (info) => info.getValue().length,
  }),
];

export const StrategiesPortfolioPage = () => {
  const { tableData, totalValue, isLoading } = useStrategyPortfolio();

  return (
    <Page title={'portfolio'}>
      <div>
        {!isLoading && (
          <div>
            <div>{totalValue.toString()}</div>

            <Table<StrategyPortfolioData>
              columns={tableColumns}
              data={tableData}
              initialSorting={[{ id: 'share', desc: true }]}
            />
          </div>
        )}
      </div>
    </Page>
  );
};
