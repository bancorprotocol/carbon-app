import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { shortenString } from 'utils/helpers';
import TelegramIcon from 'assets/icons/telegram.svg?react';
import IconDisconnect from 'assets/icons/disconnect.svg?react';
import IconCopy from 'assets/icons/copy.svg?react';

import { DropdownMenu } from 'components/common/dropdownMenu';
import { useStore } from 'store';
import { useMenuCtx } from 'components/common/dropdownMenu/utils';

export default function TonConnectBtn() {
  const [tonConnectUI] = useTonConnectUI();
  const address = useTonAddress();

  if (address) {
    return (
      <DropdownMenu
        placement="bottom-end"
        className="rounded-[10px] p-8"
        button={(attr) => (
          <button
            {...attr}
            className="btn-on-background flex items-center gap-8"
          >
            <TelegramIcon className="text-primary" />
            <span>{shortenString(address)}</span>
          </button>
        )}
      >
        <Menu />
      </DropdownMenu>
    );
  } else {
    return (
      <button
        type="button"
        className="btn-on-background flex items-center gap-8"
        onClick={() => tonConnectUI.openModal()}
      >
        <TelegramIcon />
        <span>Connect Wallet</span>
      </button>
    );
  }
}

const Menu = () => {
  const [tonConnectUI] = useTonConnectUI();
  const address = useTonAddress();
  const { toaster } = useStore();
  const { setMenuOpen } = useMenuCtx();
  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setMenuOpen(false);
    toaster.addToast('Address copied in Clipboard 👍');
  };
  return (
    <menu>
      <button
        role="menuitem"
        className="rounded-6 flex w-full items-center space-x-10 p-8 hover:bg-black"
        onClick={copyAddress}
      >
        <IconCopy className="w-16" />
        <span>Copy Address</span>
      </button>
      <button
        role="menuitem"
        className="rounded-6 flex w-full items-center space-x-10 p-8 hover:bg-black"
        onClick={() => tonConnectUI.disconnect()}
      >
        <IconDisconnect className="size-16" />
        <span>Disconnect</span>
      </button>
    </menu>
  );
};
