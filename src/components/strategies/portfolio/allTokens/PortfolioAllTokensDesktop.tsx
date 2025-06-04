import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import {
  buildAmountString,
  buildPercentageString,
} from 'components/strategies/portfolio/utils';
import { FC, useMemo } from 'react';
import { createColumnHelper, Table } from 'libs/table';
import { CellContext, Row } from '@tanstack/react-table';
import { Token } from 'libs/tokens';
import { useStore } from 'store';
import { getFiatDisplayValue } from 'utils/helpers';
import { TokenLogo } from 'components/common/imager/Imager';
import { getColorByIndex } from 'utils/colorPalettes';
import { SuspiciousToken } from 'components/common/DisplayPair';

type Props = {
  data: PortfolioData[];
  isPending: boolean;
  onRowClick: (row: Row<PortfolioData>) => void;
};

const columnHelper = createColumnHelper<PortfolioData>();

const CellToken = (info: CellContext<PortfolioData, Token>) => {
  const i = info.table.getSortedRowModel().flatRows.indexOf(info.row);
  const token = info.getValue();

  return (
    <div className="flex items-center gap-16">
      <div
        className="round-r-2 h-32 w-4"
        style={{ backgroundColor: getColorByIndex(i) }}
      />
      <TokenLogo token={token} size={32} />
      <span className="inline-flex items-center gap-4">
        {token.isSuspicious && <SuspiciousToken />}
        {token.symbol}
      </span>
    </div>
  );
};

export const PortfolioAllTokensDesktop: FC<Props> = ({
  data,
  isPending,
  onRowClick,
}) => {
  const {
    fiatCurrency: { selectedFiatCurrency },
  } = useStore();

  const tableColumns = useMemo(
    () => [
      columnHelper.accessor('token', {
        header: 'Token',
        cell: CellToken,
      }),
      columnHelper.accessor('share', {
        header: 'Share',
        cell: (info) => buildPercentageString(info.getValue()),
      }),
      columnHelper.accessor('amount', {
        header: 'Amount',
        cell: (info) =>
          buildAmountString(info.getValue(), info.row.original.token),
      }),
      columnHelper.accessor('value', {
        header: 'Value',
        cell: (info) =>
          getFiatDisplayValue(info.getValue(), selectedFiatCurrency),
      }),
    ],
    [selectedFiatCurrency],
  );

  return (
    <Table<PortfolioData>
      columns={tableColumns}
      data={data}
      onRowClick={onRowClick}
      manualSorting
      isPending={isPending}
    />
  );
};
