import { flexRender, Row, Table } from '@tanstack/react-table';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { cn } from 'utils/helpers';

interface Props<D> {
  table: Table<D>;
  onRowClick?: (row: Row<D>) => void;
  isPending?: boolean;
}

export const TBody = <D extends object>({
  table,
  onRowClick,
  isPending,
}: Props<D>) => {
  return (
    <tbody className="border-background-800 border-b-2">
      {isPending ? (
        <tr>
          <td
            colSpan={table.getVisibleFlatColumns().length}
            className="h-[320px] text-center"
          >
            <CarbonLogoLoading className="h-[80px]" />
          </td>
        </tr>
      ) : (
        table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className={cn(
              'h-64',
              'text-white/80',
              'text-16',
              'hover:bg-background-800',
              'hover:text-white',
              onRowClick && 'cursor-pointer',
            )}
            onClick={() => {
              if (onRowClick) onRowClick(row);
            }}
          >
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className={cn('last:text-right', 'last:pr-20')}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  );
};
