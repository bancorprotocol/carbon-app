import { useWeb3 } from 'providers/Web3Provider';
import { useState } from 'react';
import { lsService } from 'services/localeStorage';

export const DebugTenderlyRPC = () => {
  const { handleTenderlyRPC } = useWeb3();
  const [input, setInput] = useState(lsService.get('tenderlyRpc') || '');

  const handleOnClick = () => {
    handleTenderlyRPC(input);
  };

  return (
    <div>
      <h2>Set Tenderly RPC</h2>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleOnClick}>save</button>
    </div>
  );
};
