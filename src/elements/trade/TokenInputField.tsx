import { ChangeEvent, memo, useCallback, useState } from 'react';
import { sanitizeNumberInput } from 'utils/helpers';
import { Imager } from 'elements/Imager';
import { Token } from 'services/tokens';
import { ReactComponent as IconArrowDown } from 'assets/icons/arrowDown.svg';
import { useModal } from 'modals';
import { useTokens } from 'tokens';

export interface TokenInputProps {
  token?: Token;
  input: string;
  setInput: (amount: string) => void;
  isError: boolean;
}

const TokenInputField = ({
  token,
  input,
  setInput,
  isError,
}: TokenInputProps) => {
  const { openModal } = useModal();
  const { tokens } = useTokens();

  const [isFocused, setIsFocused] = useState(false);
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = sanitizeNumberInput(e.target.value);
      setInput(value);
    },
    [setInput]
  );

  return (
    <div
      className={`flex items-center gap-10 rounded border-2 bg-white p-20 text-24 dark:bg-charcoal ${
        isFocused ? 'border-primary' : 'dark:border-grey border-fog'
      } ${isError ? 'border-error text-error' : ''}`}
    >
      <button
        onClick={() =>
          tokens &&
          openModal('tokenLists', {
            onClick: (_) => {},
            tokens,
            limit: true,
          })
        }
        className="flex min-w-[185px] items-center gap-10"
      >
        {token ? (
          <>
            <Imager
              src={token?.logoURI}
              alt={'Token Logo'}
              className="h-[40px] w-[40px] rounded-full"
            />
            <span className="text-20">{token.symbol}</span>
          </>
        ) : (
          <span>Choose Token</span>
        )}
        <IconArrowDown className="w-14" />
      </button>
      <input
        type="text"
        dir="rtl"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={input}
        placeholder="0.00"
        onChange={handleChange}
        className={`w-full rounded bg-white outline-none dark:bg-charcoal`}
      />
    </div>
  );
};

export default memo(TokenInputField);
