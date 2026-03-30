import { useWagmi } from 'libs/wagmi';
import { NewTabLink, externalLinks } from 'libs/routing';
import config from 'config';
import { MainError } from './ErrorSDKStartSync';

export const ErrorUserBlocked = () => {
  const { disconnect } = useWagmi();

  return (
    <MainError
      title="Wallet Blocked"
      description={`For compliance reasons, this wallet has been blocked from using the ${config.appName} App.`}
    >
      <div className="grid gap-16">
        <NewTabLink
          to={externalLinks.treasuryGov}
          className="w-full btn-on-surface text-14 "
        >
          Learn More
        </NewTabLink>
        <button className="btn-on-surface text-14 " onClick={disconnect}>
          Logout
        </button>
      </div>
    </MainError>
  );
};
