import { flexRender, Row, Table } from '@tanstack/react-table';
import { cn } from 'utils/helpers';

interface Props<D> {
  table: Table<D>;
  onRowClick?: (row: Row<D>) => void;
}

export const TBody = <D extends object>({ table, onRowClick }: Props<D>) => {
  return (
    <tbody className={cn('border-b-2', 'border-emphasis')}>
      {table.getRowModel().rows.map((row) => (
        <tr
          key={row.id}
          className={cn(
            'h-64',
            'text-18',
            'font-weight-500',
            'hover:bg-darkSilver',
            onRowClick && 'cursor-pointer'
          )}
          onClick={() => {
            onRowClick && onRowClick(row);
          }}
        >
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};
