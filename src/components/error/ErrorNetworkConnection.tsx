import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { Button } from 'components/common/button';

export const ErrorNetworkConnection = () => {
  return (
    <div
      className={
        'mx-auto mt-100 w-[385px] space-y-16 rounded-10 bg-silver p-20'
      }
    >
      <IconTitleText
        icon={<IconWarning />}
        title={'Network Error'}
        text={
          'Failed to establish RPC connection. Please check your network connection and try again.'
        }
        variant={'error'}
      />
      <Button variant={'error'} fullWidth>
        Contact Support
      </Button>
    </div>
  );
};
