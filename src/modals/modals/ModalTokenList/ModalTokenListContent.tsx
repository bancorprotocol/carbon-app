import { Imager } from 'elements/Imager';
import { FC, useRef } from 'react';
import { Token } from 'tokens';
import { useVirtualizer } from '@tanstack/react-virtual';

type Props = {
  tokens: Token[];
  onSelect: (token: Token) => void;
};

export const ModalTokenListContent: FC<Props> = ({ tokens, onSelect }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: tokens.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 65,
    overscan: 10,
  });

  return (
    <div>
      <div className="text-secondary mt-20">{tokens.length} Tokens</div>

      <div
        ref={parentRef}
        style={{
          height: `390px`,
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
                    <div className="text-16">
                      {token.symbol}{' '}
                      <span className={'text-warning-500'}>
                        {token.isSuspicious && 'suspicious'}
                      </span>
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
