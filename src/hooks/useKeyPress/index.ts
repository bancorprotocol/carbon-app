import { useCallback, useEffect, useState } from 'react';

export const useKeyPress = () => {
  const [keyPressed, setKeyPressed] = useState('');

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    setKeyPressed(event.key);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    keyPressed,
  };
};
