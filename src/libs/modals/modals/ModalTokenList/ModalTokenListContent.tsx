import { FC, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Imager } from 'components/common/imager/Imager';
import { Token } from 'libs/tokens';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';

type Props = {
  tokens: Token[];
  onSelect: (token: Token) => void;
  search: string;
};

export const ModalTokenListContent: FC<Props> = ({
  tokens,
  onSelect,
  search,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: tokens.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 65,
    overscan: 10,
  });

  useEffect(() => {
    if (parentRef.current) parentRef.current.scrollTop = 0;
  }, [search]);

  return (
    <div>
      <div className="text-secondary mt-20">{tokens.length} Tokens</div>
      <div
        ref={parentRef}
        style={{
          height: '1000px',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const token = tokens[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                className={'w-full'}
                style={{
                  position: 'absolute',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <button
                  onClick={() => onSelect(token)}
                  className="flex w-full items-center"
                  style={{ height: `${virtualRow.size}px` }}
                >
                  <Imager
                    src={token.logoURI}
                    alt={`${token.symbol} Token`}
                    className="h-32 w-32 !rounded-full"
                  />
                  <div className="ml-15 grid justify-items-start">
                    <div className="flex text-16">
                      {token.symbol}
                      {token.isSuspicious && (
                        <IconWarning
                          className={'ml-10 w-14 text-warning-500'}
                        />
                      )}
                    </div>
                    <div className="text-secondary text-12">
                      {
                        // TODO: add tailwind line camp
                        token.name ?? token.symbol
                      }
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
