import { FC } from 'react';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList/ModalTradeTokenList';
import { TokensOverlap } from 'components/common/tokensOverlap';

type Props = {
  tradePairs: TradePair[];
  handleSelect: (tradePair: TradePair) => void;
};

export const ModalTradeTokenListContent: FC<Props> = ({
  tradePairs,
  handleSelect,
}) => {
  return (
    <div className={'mt-20 space-y-10'}>
      {tradePairs?.map((tradePair, i) => (
        <div key={i}>
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
      ))}
    </div>
  );
};
