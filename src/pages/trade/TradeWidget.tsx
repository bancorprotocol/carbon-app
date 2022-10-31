import TokenInputField from 'elements/trade/TokenInputField';
import { useState } from 'react';
import { Token } from 'services/tokens';

export const TradeWidget = ({ from, to }: { from?: Token; to?: Token }) => {
  const [fromInput, setFromInput] = useState('');
  const [toInput, setToInput] = useState('');
  return (
    <div className="flex flex-col gap-[10px]">
      <TokenInputField
        input={fromInput}
        setInput={setFromInput}
        token={from}
        isError={false}
      />
      <TokenInputField
        input={toInput}
        setInput={setToInput}
        token={to}
        isError={false}
      />
    </div>
  );
};
