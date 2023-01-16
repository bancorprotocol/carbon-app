import { FC, useEffect, useRef } from 'react';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList/ModalTradeTokenList';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { useVirtualizer } from '@tanstack/react-virtual';

type Props = {
  tradePairs: TradePair[];
  handleSelect: (tradePair: TradePair) => void;
  search: string;
};

export const ModalTradeTokenListContent: FC<Props> = ({
  tradePairs,
  handleSelect,
  search,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: tradePairs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 10,
  });

  useEffect(() => {
    if (parentRef.current) parentRef.current.scrollTop = 0;
  }, [search]);

  return (
    <div>
      <div className="text-secondary mt-20">{tradePairs.length} Pairs</div>

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
            const tradePair = tradePairs[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                className={'flex w-full items-center'}
                style={{
                  position: 'absolute',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <button
                  onClick={() => handleSelect(tradePair)}
                  className={'flex items-center space-x-10 pl-10'}
                >
                  <TokensOverlap
                    tokens={[tradePair.baseToken, tradePair.quoteToken]}
                  />
                  <span className={'font-weight-500'}>
                    {tradePair.baseToken.symbol} - {tradePair.quoteToken.symbol}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
