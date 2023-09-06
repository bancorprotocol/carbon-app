import { flexRender, Row, Table } from '@tanstack/react-table';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { cn } from 'utils/helpers';

interface Props<D> {
  table: Table<D>;
  onRowClick?: (row: Row<D>) => void;
  isLoading?: boolean;
}

export const TBody = <D extends object>({
  table,
  onRowClick,
  isLoading,
}: Props<D>) => {
  return (
    <tbody className={cn('border-b-2', 'border-emphasis')}>
      {isLoading ? (
        <tr>
          <td
            colSpan={table.getVisibleFlatColumns().length}
            className={cn(' h-[320px] w-full items-center justify-center')}
          >
            <div className={'h-[80px]'}>
              <CarbonLogoLoading />
            </div>
          </td>
        </tr>
      ) : (
        table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className={cn(
              'h-64',
              '!text-white/80',
              'text-16',
              'hover:bg-darkSilver',
              'hover:!text-white',
              onRowClick && 'cursor-pointer'
            )}
            onClick={() => {
              onRowClick && onRowClick(row);
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
