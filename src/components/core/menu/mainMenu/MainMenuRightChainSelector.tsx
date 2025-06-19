import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { FC } from 'react';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { cn } from 'utils/helpers';
import { AppConfig } from 'config/types';
import { setNetworkConfig } from 'config/utils';
import currentConfig from 'config';

interface Props {
  configs: AppConfig[];
}

export const MainMenuRightChainSelector: FC<Props> = ({ configs }) => {
  const activeNetwork = configs.find(
    (config) => config.network.chainId === currentConfig.network.chainId,
  );
  if (!activeNetwork || configs.length < 2) return;

  const setConfig = (config: AppConfig) => {
    setNetworkConfig(JSON.stringify(config));
  };

  return (
    <DropdownMenu
      placement="bottom"
      className="space-y-2 rounded-[12px] p-8"
      button={(attr) => (
        <button
          {...attr}
          className={cn(
            buttonStyles({ variant: 'secondary' }),
            'relative flex size-40 items-center justify-center p-0',
          )}
        >
          <img
            alt={`Select ${currentConfig.network.name}`}
            src={currentConfig.network.logoUrl}
            className="w-20"
          />
        </button>
      )}
    >
      {configs.map((config) => {
        const { logoUrl, name, chainId } = config.network;
        const isCurrentNetwork = chainId === currentConfig.network.chainId;
        return (
          <button
            key={chainId}
            role="menuitem"
            className={cn(
              'rounded-6 flex w-full items-center gap-x-10 p-12',
              isCurrentNetwork
                ? 'pointer-events-none bg-black'
                : 'hover:bg-black',
            )}
            onClick={() => setConfig(config)}
            aria-current={isCurrentNetwork}
            aria-disabled={isCurrentNetwork}
          >
            <img alt={name} src={logoUrl} className="w-20" />
            <span>{config.appName}</span>
            <IconCheck
              className={cn('ml-auto', isCurrentNetwork ? '' : 'invisible')}
            />
          </button>
        );
      })}
    </DropdownMenu>
  );
};
