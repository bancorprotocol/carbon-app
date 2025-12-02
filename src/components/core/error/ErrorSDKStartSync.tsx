import { ErrorWrapper } from 'components/core/error/ErrorWrapper';
import IconWarning from 'assets/icons/warning.svg?react';

export const ErrorSDKStartSync = () => {
  return (
    <ErrorWrapper
      icon={<IconWarning />}
      title="Internal Error"
      text="Data sync using Carbon SDK has failed. Please contact support or try again."
      variant="error"
    />
  );
};
