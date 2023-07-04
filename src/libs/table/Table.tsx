import {
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  getPaginationRowModel,
  getSortedRowModel,
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
}

export const Table = <D extends object>({
  data,
  columns,
  initialSorting = [],
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
  });

  return (
    <div className={cn('flex', 'flex-col', 'rounded-10', 'bg-silver')}>
      <table>
        <THead table={table} />
        <TBody table={table} />
        <TFoot table={table} />
      </table>
      <TPagination table={table} />
    </div>
  );
};
