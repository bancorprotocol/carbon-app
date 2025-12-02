import { useWagmi } from 'libs/wagmi';
import { NewTabLink, externalLinks } from 'libs/routing';
import { ErrorWrapper } from 'components/core/error/ErrorWrapper';
import IconWarning from 'assets/icons/warning.svg?react';
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
      <NewTabLink
        to={externalLinks.treasuryGov}
        className="w-full btn-on-surface text-14 "
      >
        Learn More
      </NewTabLink>
      <button className="btn-on-surface text-14 " onClick={disconnect}>
        Logout
      </button>
    </ErrorWrapper>
  );
};
