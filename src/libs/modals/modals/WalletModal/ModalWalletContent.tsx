import { FC, useState } from 'react';
import { NewTabLink, Link } from 'libs/routing';
import { Connector, useWagmi } from 'libs/wagmi';
import { Imager } from 'components/common/imager/Imager';
import { Checkbox } from 'components/common/Checkbox/Checkbox';
import iconLedger from 'assets/logos/ledger.svg';
import iconTrezor from 'assets/logos/trezor.svg';
import { WalletIcon } from 'components/common/WalletIcon';

type Props = {
  onClick: (c: Connector) => Promise<void>;
  isPending?: boolean;
};

const textClasses = 'text-16 font-weight-500';
const buttonClasses =
  'flex h-44 w-full items-center space-x-16 rounded-8 px-10 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent';

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

  const { connectors } = useWagmi();

  const isDisabled = isPending || !checked;

  return (
    <div className="space-y-10">
      <div className="text-14 mb-20 space-y-10 text-white/80">
        <p>
          By connecting my wallet, I agree to the{' '}
          <Link
            to="/terms"
            target="_blank"
            className="font-weight-500 text-white"
          >
            terms & conditions
          </Link>{' '}
          and{' '}
          <Link
            target="_blank"
            to="/privacy"
            className="font-weight-500 text-white"
          >
            cookie & privacy policy
          </Link>{' '}
          of this site.{' '}
        </p>
        <div className="flex items-center space-x-10">
          <Checkbox isChecked={checked} setIsChecked={setChecked} />
          <button onClick={() => setChecked((prev) => !prev)}>
            I read and accept
          </button>
        </div>
      </div>

      {connectors.map((c) => {
        return (
          <button
            key={c.uid}
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
