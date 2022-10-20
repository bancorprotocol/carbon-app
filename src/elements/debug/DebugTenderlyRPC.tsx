import { useWeb3 } from 'services/web3-react/Web3Provider';
import { useState } from 'react';
import {
  getLocaleStorage,
  LocaleStorageId,
} from 'services/localeStorage/index';

export const DebugTenderlyRPC = () => {
  const { handleTenderlyRPC } = useWeb3();
  const [input, setInput] = useState(
    getLocaleStorage(LocaleStorageId.TENDERLY_RPC) || ''
  );

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
