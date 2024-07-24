import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { FC, useState } from 'react';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { carbonEvents } from 'services/events';
import { cn } from 'utils/helpers';

interface Props {
  networks: {
    id: string;
    name: string;
    logoUrl: string;
    isCurrentNetwork: boolean;
    selectNetwork: () => void;
  }[];
}

export const MainMenuRightChainSelector: FC<Props> = ({ networks }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeNetwork = networks.find((network) => network.isCurrentNetwork);
  if (!activeNetwork) return;

  return (
    <DropdownMenu
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      placement="bottom"
      className="space-y-2 rounded-[12px] p-8"
      aria-expanded={isOpen}
      button={(attr) => (
        <button
          {...attr}
          className={cn(buttonStyles({ variant: 'secondary' }), 'relative p-0')}
          onClick={(e) => {
            setIsOpen(true);
            carbonEvents.navigation.navNetworkClick(undefined);
            attr.onClick(e);
          }}
        >
          <span className="flex items-center justify-center p-10">
            <img
              alt={`Select ${activeNetwork.name}`}
              src={activeNetwork.logoUrl}
              className="w-20"
            />
          </span>
        </button>
      )}
    >
      {networks.map((network) => {
        const { id, name, logoUrl, isCurrentNetwork } = network;
        return (
          <button
            key={id}
            role="menuitem"
            className={cn(
              'rounded-6 flex w-full items-center space-x-10 p-12',
              isCurrentNetwork ? 'bg-black' : 'hover:bg-black'
            )}
            onClick={network.selectNetwork}
            disabled={isCurrentNetwork}
          >
            <img alt={name} src={logoUrl} className="w-20" />
            <span>{name}</span>
            {isCurrentNetwork && <IconCheck className="ml-auto" />}
          </button>
        );
      })}
    </DropdownMenu>
  );
};
