import { useWeb3 } from 'web3';
import { useState } from 'react';
import { lsService } from 'services/localeStorage';

export const DebugImposter = () => {
  const { handleImposterAccount } = useWeb3();
  const [input, setInput] = useState(
    lsService.getItem('imposterAccount') || ''
  );

  const handleOnClick = () => {
    handleImposterAccount(input);
  };

  return (
    <div>
      <h2>Set Imposter Account</h2>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleOnClick}>save</button>
    </div>
  );
};
