import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { FC } from 'react';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { carbonEvents } from 'services/events';
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

  return (
    <DropdownMenu
      placement="bottom"
      className="space-y-2 rounded-[12px] p-8"
      button={(attr) => (
        <button
          {...attr}
          className={cn(
            buttonStyles({ variant: 'secondary' }),
            'relative flex size-40 items-center justify-center p-0'
          )}
          onClick={(e) => {
            carbonEvents.navigation.navNetworkClick(undefined);
            attr.onClick(e);
          }}
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
            role="menuitem"
            className={cn(
              'rounded-6 flex w-full items-center gap-x-10 p-12',
              isCurrentNetwork
                ? 'pointer-events-none bg-black'
                : 'hover:bg-black'
            )}
            href={appUrl}
            aria-current={isCurrentNetwork}
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
