import { ChangeEvent, memo, useCallback, useMemo, useState } from 'react';
import { Imager } from 'elements/Image';
import useDimensions from 'hooks/useDimantions';
import { useResizeTokenInput } from './useResizeTokenInput';
import { Token } from 'services/tokens';
import { sanitizeNumberInput } from 'utils/helpers';

export interface TokenInputProps {
  token: Token;
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
      className={`rounded-20 dark:bg-charcoal relative flex items-center border-2 bg-white text-[36px] ${
        isFocused ? 'border-primary' : 'border-fog dark:border-grey'
      } ${isError ? 'border-error text-error' : ''}`}
    >
      <Imager
        src={token.logoURI}
        alt={'Token Logo'}
        className="absolute ml-20 h-[40px] w-[40px] !rounded-full"
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
        } dark:bg-charcoal rounded-20 font-inherit ml-[80px] h-[75px] bg-white outline-none`}
        style={{
          maxWidth: maxInputWidth,
        }}
      />
      <span ref={symbolRef} className="text-16 ml-5">
        {token.symbol}
      </span>
      {/* <span ref={oppositeRef} className="text-12 absolute right-[10px]">
        {prettifyNumber(isFiat ? inputTkn : inputFiat, !isFiat)} {oppositeUnit}
      </span> */}
    </div>
  );
};

export default memo(TokenInputField);
