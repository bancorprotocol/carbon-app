import { PortfolioTokenData } from './usePortfolioToken';
import { createColumnHelper, Table } from 'libs/table';
import { FC } from 'react';
import { cn, prettifyNumber } from 'utils/helpers';

export type PortfolioTokenProps = {
  data: PortfolioTokenData[];
  isLoading: boolean;
};

const columnHelper = createColumnHelper<PortfolioTokenData>();

const tableColumns = [
  columnHelper.accessor('strategy.idDisplay', {
    header: () => <span className={cn('ps-20')}>ID</span>,
    cell: (info) => info.getValue(),
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
