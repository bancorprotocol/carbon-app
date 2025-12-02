import { ErrorWrapper } from 'components/core/error/ErrorWrapper';
import IconWarning from 'assets/icons/warning.svg?react';

export const ErrorTokenList = () => {
  return (
    <ErrorWrapper
      icon={<IconWarning />}
      title="Network Error"
      text="Failed to fetch token list. Please check your network connection and try again."
      variant="error"
    />
  );
};
