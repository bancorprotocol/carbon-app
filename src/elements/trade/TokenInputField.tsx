import { ChangeEvent, memo, useCallback, useMemo, useState } from 'react';
import { useResizeTokenInput } from './useResizeTokenInput';
import { sanitizeNumberInput } from 'utils/helpers';
import useDimensions from 'hooks/useDimantions';
import { Imager } from 'elements/Image';
import { Token } from 'services/tokens';

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
  const [isFocused, setIsFocused] = useState(false);
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = sanitizeNumberInput(e.target.value);
      setInput(value);
    },
    [setInput]
  );

  const { observe: containerRef, width: containerWidth } = useDimensions();
  const { width: oppositeWidth } = useDimensions();
  const { observe: symbolRef, width: symbolWidth } = useDimensions();
  const maxInputWidth = useMemo(
    () => containerWidth - symbolWidth - oppositeWidth - 120,
    [oppositeWidth, symbolWidth, containerWidth]
  );
  const { inputRef, helperRef } = useResizeTokenInput({
    input,
  });
  return (
    <div
      ref={containerRef}
      onClick={() => {
        inputRef.current && inputRef.current.focus();
      }}
      className={`relative flex items-center rounded-[20px] border-2 bg-white text-[24px] dark:bg-charcoal ${
        isFocused ? 'border-primary' : 'border-fog dark:border-grey'
      } ${isError ? 'border-error text-error' : ''}`}
    >
      <Imager
        src={token?.logoURI}
        alt={'Token Logo'}
        className="absolute ml-[20px] h-[40px] w-[40px] !rounded-full"
      />
      <span
        ref={helperRef}
        className="absolute h-0 overflow-hidden whitespace-pre"
      />
      <input
        ref={inputRef}
        type="text"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={input}
        placeholder="0.00"
        onChange={handleChange}
        className={`${
          input === '' ? 'min-w-[80px]' : 'min-w-[10px]'
        } ml-[80px] h-[75px] rounded-[20px] bg-white outline-none dark:bg-charcoal`}
        style={{
          maxWidth: maxInputWidth,
        }}
      />
      <span ref={symbolRef} className="text-16 ml-[5px]">
        {token?.symbol}
      </span>
    </div>
  );
};

export default memo(TokenInputField);
