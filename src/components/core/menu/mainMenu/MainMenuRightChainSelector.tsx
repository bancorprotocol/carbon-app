import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { FC } from 'react';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { cn } from 'utils/helpers';

interface Props {
  networks: {
    id: string;
    name: string;
    logoUrl: string;
    appUrl: string;
    chainId: number;
    isCurrentNetwork: boolean;
  }[];
}
export const MainMenuRightChainSelector: FC<Props> = ({ networks }) => {
  const activeNetwork = networks.find((network) => network.isCurrentNetwork);
  if (!activeNetwork || networks.length < 2) return;

  const getFullPath = (path: string) => {
    const firstPathName = window.location.pathname.split('/')[1];
    return path + '/' + firstPathName;
  };

  return (
    <DropdownMenu
      placement="bottom"
      className="rounded-xl p-8 grid gap-4"
      button={(attr) => (
        <button
          {...attr}
          className="btn-secondary-gradient relative flex size-40 items-center justify-center p-0"
        >
          <img
            alt={`Select ${activeNetwork.name}`}
            src={activeNetwork.logoUrl}
            className="w-20"
          />
        </button>
      )}
    >
      {networks.map((network) => {
        const { id, name, logoUrl, appUrl, isCurrentNetwork } = network;
        return (
          <a
            key={id}
            role="menuitemradio"
            className="rounded-sm flex w-full items-center gap-x-10 p-12 hover:bg-black/40 aria-selected:bg-black/60 aria-disabled:pointer-events-none"
            href={getFullPath(appUrl)}
            aria-selected={isCurrentNetwork}
            aria-disabled={isCurrentNetwork}
          >
            <img alt={name} src={logoUrl} className="w-20" />
            <span>{name}</span>
            <IconCheck
              className={cn('ml-auto', isCurrentNetwork ? '' : 'invisible')}
            />
          </a>
        );
      })}
    </DropdownMenu>
  );
};
