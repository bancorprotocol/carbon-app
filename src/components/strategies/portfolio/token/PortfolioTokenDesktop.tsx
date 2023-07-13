import { CellContext } from '@tanstack/react-table';
import { getColorByIndex } from 'utils/colorPalettes';
import { PortfolioTokenData } from './usePortfolioToken';
import { createColumnHelper, Table } from 'libs/table';
import { FC } from 'react';
import { cn, prettifyNumber } from 'utils/helpers';

export type PortfolioTokenProps = {
  data: PortfolioTokenData[];
  isLoading: boolean;
};

const columnHelper = createColumnHelper<PortfolioTokenData>();

const CellID = (info: CellContext<PortfolioTokenData, string>) => {
  const i = info.table.getSortedRowModel().flatRows.indexOf(info.row);
  const id = info.getValue();

  return (
    <div className={cn('flex', 'items-center', 'space-s-16')}>
      <div
        className={cn('h-32', 'w-4', 'bg-blue', 'rounded-r-2')}
        style={{
          backgroundColor: getColorByIndex(i),
        }}
      />
      <div>{id}</div>
    </div>
  );
};

const tableColumns = [
  columnHelper.accessor('strategy.idDisplay', {
    header: 'ID',
    cell: CellID,
  }),
  columnHelper.accessor('strategy', {
    header: 'Pair',
    cell: (info) => {
      const { base, quote } = info.getValue();
      return `${base.symbol}/${quote.symbol}`;
    },
  }),
  columnHelper.accessor('share', {
    header: 'Share',
    cell: (info) => `${info.getValue().toFixed(2)} %`,
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: (info) => `${prettifyNumber(info.getValue())} ????`,
  }),
  columnHelper.accessor('value', {
    header: 'Value',
    // TODO dont hardcode fiat currency
    cell: (info) => `$${prettifyNumber(info.getValue())} ???`,
  }),
];

export const PortfolioTokenDesktop: FC<PortfolioTokenProps> = ({
  data,
  isLoading,
}) => {
  return (
    <Table<PortfolioTokenData>
      columns={tableColumns}
      data={data}
      manualSorting
      isLoading={isLoading}
    />
  );
};
