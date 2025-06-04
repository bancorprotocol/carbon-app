import { flexRender, Table } from '@tanstack/react-table';
import { cn } from 'utils/helpers';

export const THead = <D extends object>({ table }: { table: Table<D> }) => {
  return (
    <thead className={cn('border-b-2', 'border-background-800')}>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} className="h-64">
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              colSpan={header.colSpan}
              className={cn(
                'text-left',
                'first:pl-20',
                'last:text-right',
                'last:pr-20',
              )}
            >
              {header.isPlaceholder ? null : (
                <div
                  {...{
                    className: cn(
                      'text-16',
                      'font-weight-500',
                      'font-mono',
                      'text-white/60',
                      {
                        'cursor-pointer': header.column.getCanSort(),
                        'select-none': header.column.getCanSort(),
                      },
                    ),
                    onClick: header.column.getToggleSortingHandler(),
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
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
