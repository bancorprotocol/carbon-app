import { FC } from 'react';
import { ReactComponent as IconChevronLeft } from 'assets/icons/chevron-left.svg';

interface Props {
  size: number;
  offset: number;
  setOffset: (value: number) => void;
  limit: number;
  setLimit: (value: number) => void;
}

export const Paginator: FC<Props> = (props) => {
  const { size, offset, setOffset, limit, setLimit } = props;

  const currentPage = Math.ceil(offset / limit) + 1;
  const maxPage = Math.ceil(size / limit);
  const maxOffset = Math.max((maxPage - 1) * limit, 0);

  const firstPage = () => setOffset(0);
  const lastPage = () => setOffset(maxOffset);
  const previousPage = () => setOffset(Math.max(offset - limit, 0));
  const nextPage = () => setOffset(Math.min(offset + limit, maxOffset));

  return (
    <tfoot>
      <tr>
        <td colSpan={100}>
          <div className="flex justify-between">
            <div className="flex items-center gap-8">
              <label>Show results</label>
              <select
                className="border-background-800 bg-new-primary rounded-full border-2 px-12 py-8"
                name="limit"
                onChange={(e) => setLimit(Number(e.target.value))}
                value={limit}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
              </select>
            </div>
            <div role="group" className="flex justify-end gap-8">
              <button
                onClick={firstPage}
                disabled={!offset}
                aria-label="First page"
                className="disabled:opacity-50"
              >
                First
              </button>
              <button
                onClick={previousPage}
                disabled={!offset}
                aria-label="Previous page"
                className="p-8 disabled:opacity-50"
              >
                <IconChevronLeft className="size-12" />
              </button>
              <p
                className="border-background-800 flex gap-8 rounded-full border-2 px-12 py-8"
                aria-label="page position"
              >
                <span className="text-white">{currentPage}</span>
                <span role="separator">/</span>
                <span className="text-white">{maxPage}</span>
              </p>
              <button
                onClick={nextPage}
                disabled={currentPage === maxPage}
                aria-label="Next page"
                className="p-8 disabled:opacity-50"
              >
                <IconChevronLeft className="size-12 rotate-180" />
              </button>
              <button
                onClick={lastPage}
                disabled={currentPage === maxPage}
                aria-label="Last page"
                className="disabled:opacity-50"
              >
                Last
              </button>
            </div>
          </div>
        </td>
      </tr>
    </tfoot>
  );
};
