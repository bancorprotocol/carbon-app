import { useWeb3 } from 'libs/web3';
import { useState } from 'react';
import { lsService } from 'services/localeStorage';
import { InputUserAccount } from 'components/common/inputField';
import { Button } from 'components/common/button';

export const DebugImposter = () => {
  const { handleImposterAccount } = useWeb3();
  const [input, setInput] = useState(
    lsService.getItem('imposterAccount') || ''
  );

  const handleOnClick = () => {
    handleImposterAccount(input);
  };

  return (
    <div
      className={
        'bg-secondary flex flex-col items-center space-y-20 rounded-18 p-20'
      }
    >
      <h2>Set Imposter Account</h2>
      <InputUserAccount
        label={'Imposter Account'}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <Button data-testid="save-imposter" onClick={handleOnClick}>
        Save
      </Button>
    </div>
  );
};
