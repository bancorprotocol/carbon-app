import { useWagmi } from 'libs/wagmi';
import { NewTabLink, externalLinks } from 'libs/routing';
import { ErrorWrapper } from 'components/core/error/ErrorWrapper';
import { Button } from 'components/common/button';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import config from 'config';

export const ErrorUserBlocked = () => {
  const { disconnect } = useWagmi();

  return (
    <ErrorWrapper
      icon={<IconWarning />}
      title="Wallet Blocked"
      text={`For compliance reasons, this wallet has been blocked from using the ${config.appName} App.`}
      variant="error"
    >
      <div className="space-y-10">
        <NewTabLink to={externalLinks.treasuryGov} className="w-full">
          <Button fullWidth>Learn More</Button>
        </NewTabLink>
        <Button variant="black" onClick={disconnect} fullWidth>
          Logout
        </Button>
      </div>
    </ErrorWrapper>
  );
};
