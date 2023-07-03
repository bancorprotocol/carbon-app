import {
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { THead } from 'libs/table/THead';
import { TBody } from 'libs/table/TBody';
import { TFoot } from 'libs/table/TFoot';
import { TPagination } from 'libs/table/TPagination';

interface TableProps<D extends object> {
  columns: ColumnDef<D, any>[];
  data: D[];
}

export const Table = <D extends object>({ data, columns }: TableProps<D>) => {
  const table = useReactTable<D>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel<D>(),
    getPaginationRowModel: getPaginationRowModel<D>(),
  });

  return (
    <>
      <table>
        <THead table={table} />
        <TBody table={table} />
        <TFoot table={table} />
      </table>
      <TPagination table={table} />
    </>
  );
};
