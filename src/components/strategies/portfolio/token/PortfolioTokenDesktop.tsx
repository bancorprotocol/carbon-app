import { CellContext } from '@tanstack/react-table';
import {
  buildAmountString,
  buildPairNameByStrategy,
  buildPercentageString,
} from 'components/strategies/portfolio/utils';
import { Token } from 'libs/tokens';
import { useStore } from 'store';
import { getColorByIndex } from 'utils/colorPalettes';
import { PortfolioTokenData } from './usePortfolioToken';
import { createColumnHelper, Table } from 'libs/table';
import { FC, useMemo } from 'react';
import { cn, getFiatDisplayValue } from 'utils/helpers';

export type PortfolioTokenProps = {
  selectedToken: Token;
  data: PortfolioTokenData[];
  isPending: boolean;
};

const columnHelper = createColumnHelper<PortfolioTokenData>();

const CellID = (info: CellContext<PortfolioTokenData, string>) => {
  const i = info.table.getSortedRowModel().flatRows.indexOf(info.row);
  const id = info.getValue();

  return (
    <div className={cn('flex', 'items-center', 'space-x-16')}>
      <div
        className={cn('h-32', 'w-4', 'rounded-r-2')}
        style={{ backgroundColor: getColorByIndex(i) }}
      />
      <div>{id}</div>
    </div>
  );
};

export const PortfolioTokenDesktop: FC<PortfolioTokenProps> = ({
  selectedToken,
  data,
  isPending,
}) => {
  const {
    fiatCurrency: { selectedFiatCurrency },
  } = useStore();

  const tableColumns = useMemo(
    () => [
      columnHelper.accessor('strategy.idDisplay', {
        header: 'ID',
        cell: CellID,
      }),
      columnHelper.accessor('strategy', {
        header: 'Pair',
        cell: (info) => buildPairNameByStrategy(info.getValue()),
      }),
      columnHelper.accessor('share', {
        header: 'Share',
        cell: (info) => buildPercentageString(info.getValue()),
      }),
      columnHelper.accessor('amount', {
        header: 'Amount',
        cell: (info) => buildAmountString(info.getValue(), selectedToken),
      }),
      columnHelper.accessor('value', {
        header: 'Value',
        cell: (info) =>
          getFiatDisplayValue(info.getValue(), selectedFiatCurrency),
      }),
    ],
    [selectedFiatCurrency, selectedToken],
  );

  return (
    <Table<PortfolioTokenData>
      columns={tableColumns}
      data={data}
      manualSorting
      isPending={isPending}
    />
  );
};
