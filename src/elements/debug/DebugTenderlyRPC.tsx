import { useWeb3 } from 'web3';
import { useState } from 'react';
import { lsService } from 'services/localeStorage';
import { Button } from 'components/Button';

export const DebugTenderlyRPC = () => {
  const { handleTenderlyRPC } = useWeb3();
  const [input, setInput] = useState(lsService.getItem('tenderlyRpc') || '');

  const handleOnClick = () => {
    handleTenderlyRPC(input);
  };

  return (
    <div>
      <h2>Set Tenderly RPC</h2>
      <div className="flex items-center gap-10">
        <input
          className="w-[600px] rounded bg-white outline-none dark:bg-charcoal"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={handleOnClick} className="rounded-full">
          Save
        </Button>
      </div>
    </div>
  );
};
