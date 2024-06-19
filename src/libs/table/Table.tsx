import {
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
} from '@tanstack/react-table';
import { THead } from 'libs/table/THead';
import { TBody } from 'libs/table/TBody';
import { TFoot } from 'libs/table/TFoot';
import { TPagination } from 'libs/table/TPagination';
import { useState } from 'react';
import { SortingState } from 'libs/table/types';
import { cn } from 'utils/helpers';

interface TableProps<D extends object> {
  columns: ColumnDef<D, any>[];
  data: D[];
  initialSorting?: SortingState<D>;
  onRowClick?: (row: Row<D>) => void;
  manualSorting?: boolean;
  isPending?: boolean;
}

export const Table = <D extends object>({
  data,
  columns,
  initialSorting = [],
  onRowClick,
  manualSorting,
  isPending,
}: TableProps<D>) => {
  const [sorting, setSorting] = useState<SortingState<D>>(initialSorting);

  const table = useReactTable<D>({
    data,
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel<D>(),
    getPaginationRowModel: getPaginationRowModel<D>(),
    getSortedRowModel: getSortedRowModel<D>(),
    onSortingChange: setSorting,
    manualSorting,
    enableSorting: !manualSorting,
  });

  return (
    <div className={cn('flex', 'flex-col', 'rounded-10', 'bg-background-900')}>
      <table>
        <THead table={table} />
        <TBody table={table} onRowClick={onRowClick} isPending={isPending} />
        <TFoot table={table} />
      </table>
      <TPagination table={table} />
    </div>
  );
};
