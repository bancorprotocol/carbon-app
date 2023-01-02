import { Button } from 'components/common/button';
import TokenInputField from 'components/trade/TokenInputField';
import { useState } from 'react';
import { Token } from 'tokens';

export const TradeWidget = ({ from, to }: { from?: Token; to?: Token }) => {
  const [fromInput, setFromInput] = useState('');
  const [toInput, setToInput] = useState('');

  return (
    <div className="flex flex-col gap-10 p-10 md:p-30">
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
      <Button className="h-50 rounded-full">Trade</Button>
    </div>
  );
};
