import { FC, useId, useState } from 'react';
import { NewTabLink, Link } from 'libs/routing';
import { Connector, useWagmi } from 'libs/wagmi';
import { Imager } from 'components/common/imager/Imager';
import iconLedger from 'assets/logos/ledger.svg';
import iconTrezor from 'assets/logos/trezor.svg';
import { WalletIcon } from 'components/common/WalletIcon';

type Props = {
  onClick: (c: Connector) => Promise<void>;
  isPending?: boolean;
};

const textClasses = 'text-16 font-medium';
const buttonClasses =
  'flex h-44 w-full items-center gap-16 rounded-md px-10 hover:bg-main-900/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent';

const EXT_LINKS = [
  {
    name: 'Ledger',
    logoUrl: iconLedger,
    url: 'https://www.ledger.com/academy/security/the-safest-way-to-use-metamask',
  },
  {
    name: 'Trezor',
    logoUrl: iconTrezor,
    url: 'https://trezor.io/learn/a/metamask-and-trezor',
  },
];

export const ModalWalletContent: FC<Props> = ({ onClick, isPending }) => {
  const [checked, setChecked] = useState(false);
  const checkoxId = useId();

  const { connectors } = useWagmi();

  const isDisabled = isPending || !checked;

  return (
    <div className="grid gap-8">
      <div className="text-14 mb-20 grid gap-8 text-white/80">
        <p>
          By connecting my wallet, I agree to the{' '}
          <Link to="/terms" target="_blank" className="font-medium text-white">
            terms & conditions
          </Link>{' '}
          and{' '}
          <Link
            target="_blank"
            to="/privacy"
            className="font-medium text-white"
          >
            cookie & privacy policy
          </Link>{' '}
          of this site.{' '}
        </p>
        <div className="flex items-center gap-8">
          <input
            id={checkoxId}
            className="size-18 shrink-0"
            type="checkbox"
            checked={checked}
            onChange={() => setChecked((v) => !v)}
          />
          <label htmlFor={checkoxId}>I read and accept</label>
        </div>
      </div>

      {connectors.map((c) => {
        return (
          <button
            key={c.uid}
            type="button"
            onClick={() => onClick(c)}
            className={buttonClasses}
            disabled={isDisabled}
          >
            <WalletIcon
              selectedWallet={c.name}
              className="w-24"
              icon={c.icon}
            />
            <span className={textClasses}>{c?.name}</span>
          </button>
        );
      })}

      {EXT_LINKS.map(({ url, name, logoUrl }) => (
        <NewTabLink
          key={url}
          to={url}
          className={`${buttonClasses} ${
            isDisabled
              ? 'pointer-events-none cursor-not-allowed opacity-50 hover:bg-transparent'
              : ''
          }`}
          disabled={isDisabled}
        >
          <div className="flex w-24 justify-center">
            <Imager alt="Wallet Logo" src={logoUrl} className="h-24" />
          </div>
          <span className={textClasses}>{name}</span>
        </NewTabLink>
      ))}
    </div>
  );
};
