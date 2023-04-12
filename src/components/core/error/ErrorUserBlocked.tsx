import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { ErrorWrapper } from 'components/core/error/ErrorWrapper';
import { useWeb3 } from 'libs/web3';
import { Button } from 'components/common/button';
import { Link } from 'libs/routing';

export const ErrorUserBlocked = () => {
  const { disconnect } = useWeb3();
  return (
    <ErrorWrapper
      icon={<IconWarning />}
      title={'Wallet Blocked'}
      text={
        'For compliance reasons, this wallet has been blocked from using the Carbon App.'
      }
      variant={'error'}
    >
      <div className={'space-y-10'}>
        <Link
          to={
            'https://home.treasury.gov/policy-issues/financial-sanctions/recent-actions/20220808'
          }
          className={'w-full'}
        >
          <Button fullWidth>Learn More</Button>
        </Link>
        <Button variant={'black'} onClick={disconnect} fullWidth>
          Logout
        </Button>
      </div>
    </ErrorWrapper>
  );
};
