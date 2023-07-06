import { flexRender, Table } from '@tanstack/react-table';
import { cn } from 'utils/helpers';

export const THead = <D extends object>({ table }: { table: Table<D> }) => {
  return (
    <thead className={cn('border-b-2', 'border-emphasis')}>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} className={cn('h-64')}>
          {headerGroup.headers.map((header) => (
            <th key={header.id} colSpan={header.colSpan}>
              {header.isPlaceholder ? null : (
                <div
                  {...{
                    className: cn(
                      'text-left',
                      '!font-mono',
                      'text-16',
                      'font-weight-500',
                      'text-white/60',
                      {
                        'cursor-pointer': header.column.getCanSort(),
                        'select-none': header.column.getCanSort(),
                      }
                    ),
                    onClick: header.column.getToggleSortingHandler(),
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: ' 🔼',
                    desc: ' 🔽',
                  }[header.column.getIsSorted() as string] ?? null}
                </div>
              )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
};
