import { useWeb3 } from 'web3';
import { useState } from 'react';
import { lsService } from 'services/localeStorage';

export const DebugTenderlyRPC = () => {
  const { handleTenderlyRPC } = useWeb3();
  const [input, setInput] = useState(lsService.getItem('tenderlyRpc') || '');

  const handleOnClick = () => {
    handleTenderlyRPC(input);
  };

  return (
    <>
      <h2>Set Tenderly RPC</h2>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleOnClick}>save</button>
    </>
  );
};
