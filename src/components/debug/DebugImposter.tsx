import { useWagmi } from 'libs/wagmi';
import { useState } from 'react';
import { lsService } from 'services/localeStorage';
import { InputUserAccount } from 'components/common/inputField';
import { getAddress } from 'ethers';

export const DebugImposter = () => {
  const { setImposterAccount } = useWagmi();
  const [input, setInput] = useState(
    lsService.getItem('imposterAccount') ?? '',
  );

  const sanitizeImposterAccount = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    try {
      return getAddress(trimmed);
    } catch {
      return undefined;
    }
  };

  const handleOnClick = () => {
    const sanitized = sanitizeImposterAccount(input);
    setImposterAccount(sanitized);
    setInput(sanitized ?? input.trim());
  };

  return (
    <div className="rounded-3xl surface grid content-start place-items-center gap-20 p-20">
      <h2>Set Imposter Account</h2>
      <InputUserAccount
        label="Imposter Account"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        className="btn-primary-gradient"
        data-testid="save-imposter"
        onClick={handleOnClick}
      >
        Save
      </button>
    </div>
  );
};
