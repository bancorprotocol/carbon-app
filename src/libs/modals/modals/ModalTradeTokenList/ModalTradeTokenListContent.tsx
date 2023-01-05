import { FC } from 'react';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList/ModalTradeTokenList';

type Props = {
  tradePairs: TradePair[];
  handleSelect: (tradePair: TradePair) => void;
};

export const ModalTradeTokenListContent: FC<Props> = ({
  tradePairs,
  handleSelect,
}) => {
  return (
    <div>
      {tradePairs?.map((tradePair, i) => (
        <div key={i}>
          <button onClick={() => handleSelect(tradePair)}>
            {tradePair.baseToken.symbol}/{tradePair.quoteToken.symbol}
          </button>
        </div>
      ))}
    </div>
  );
};
