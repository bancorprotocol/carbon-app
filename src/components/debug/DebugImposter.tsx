import { useWagmi } from 'libs/wagmi';
import { useState } from 'react';
import { lsService } from 'services/localeStorage';
import { InputUserAccount } from 'components/common/inputField';
import { Button } from 'components/common/button';

export const DebugImposter = () => {
  const { setImposterAccount } = useWagmi();
  const [input, setInput] = useState(lsService.getItem('imposterAccount'));

  const handleOnClick = () => {
    setImposterAccount(input);
  };

  return (
    <div className="rounded-3xl bg-white-gradient grid content-start place-items-center gap-20 p-20">
      <h2>Set Imposter Account</h2>
      <InputUserAccount
        label="Imposter Account"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <Button data-testid="save-imposter" onClick={handleOnClick}>
        Save
      </Button>
    </div>
  );
};
