import { Table } from '@tanstack/react-table';
import { cn } from 'utils/helpers';

export const TPagination = <D extends object>({
  table,
}: {
  table: Table<D>;
}) => {
  const pageCount = table.getPageCount();

  return (
    <div
      className={cn(
        'font-mono',
        'h-64',
        'flex',
        'items-center',
        'justify-between',
        'px-32',
        '!text-14',
        'text-white/60'
      )}
    >
      <div>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className={cn('bg-silver')}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      <div className={cn('flex', 'items-center', 'gap-10')}>
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          First
        </button>

        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>

        <span
          className={cn(
            'px-14',
            'py-4',
            'text-white',
            'border',
            'border-emphasis',
            'rounded-full'
          )}
        >
          {table.getState().pagination.pageIndex + 1}{' '}
          <span className={cn('text-white/60')}>/</span> {pageCount}
        </span>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>

        <button
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
        >
          Last
        </button>
      </div>
    </div>
  );
};
