import { ErrorWrapper } from 'components/core/error/ErrorWrapper';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';

export const ErrorNetworkConnection = () => {
  return (
    <ErrorWrapper
      icon={<IconWarning />}
      title={'Network Error'}
      text={
        'Failed to establish RPC connection. Please check your network connection and try again.'
      }
      variant={'error'}
    />
  );
};
