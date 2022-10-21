import { useWeb3 } from 'providers/Web3Provider';
import { useState } from 'react';

export const DebugImposter = () => {
  const { setImposterAccount } = useWeb3();
  const [input, setInput] = useState('');

  const handleOnClick = () => {
    setImposterAccount(input);
  };

  return (
    <div>
      <h2>Set Imposter Account</h2>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleOnClick}>save</button>
    </div>
  );
};
