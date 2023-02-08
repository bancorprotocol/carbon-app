import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { ErrorWrapper } from 'components/core/error/ErrorWrapper';

export const ErrorTokenList = () => {
  return (
    <ErrorWrapper
      icon={<IconWarning />}
      title={'Network Error'}
      text={
        'Failed to fetch token list. Please check your network connection and try again.'
      }
      variant={'error'}
    />
  );
};
