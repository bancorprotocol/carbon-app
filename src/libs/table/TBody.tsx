import { flexRender, Table } from '@tanstack/react-table';
import { cn } from 'utils/helpers';

export const TBody = <D extends object>({ table }: { table: Table<D> }) => {
  return (
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <tr
          key={row.id}
          className={cn(
            'h-64',
            'text-18',
            'font-weight-500',
            'hover:bg-darkSilver'
          )}
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
