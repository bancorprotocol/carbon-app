import { useCallback, ChangeEvent } from 'react';
import { sanitizeNumberInput } from 'utils/helpers';

export const useSanitizeInput = (setInput: (value: string) => void) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = sanitizeNumberInput(e.target.value);
      setInput(value);
    },
    [setInput]
  );

  return handleChange;
};
