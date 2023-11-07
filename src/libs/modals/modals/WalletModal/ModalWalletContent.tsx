import { FC, useState } from 'react';
import { Link, PathNames } from 'libs/routing';
import { Connection, selectableConnectionTypes } from 'libs/web3';
import { getConnection } from 'libs/web3/web3.utils';
import { Imager } from 'components/common/imager/Imager';
import { Checkbox } from 'components/common/Checkbox/Checkbox';
import iconLedger from 'assets/logos/ledger.svg';
import iconTrezor from 'assets/logos/trezor.svg';

type Props = {
  onClick: (c: Connection) => Promise<void>;
  isLoading?: boolean;
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

export const ModalWalletContent: FC<Props> = ({ onClick, isLoading }) => {
  const [checked, setChecked] = useState(false);

  const isDisabled = isLoading || !checked;

  return (
    <div className="space-y-10">
      <div className="mb-20 space-y-10 text-14 text-white/80">
        <p>
          By connecting my wallet, I agree to the{' '}
          <Link
            to={PathNames.terms}
            target="_blank"
            className="font-weight-500 text-white"
          >
            terms & conditions
          </Link>{' '}
          and{' '}
          <Link
            target="_blank"
            to={PathNames.privacy}
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

      {selectableConnectionTypes.map(getConnection).map((c) => (
        <button
          key={c.type}
          onClick={() => onClick(c)}
          className={buttonClasses}
          disabled={isDisabled}
        >
          <Imager alt="Wallet Logo" src={c.logoUrl} className="w-24" />
          <span className={textClasses}>{c.name}</span>
        </button>
      ))}

      {EXT_LINKS.map(({ url, name, logoUrl }) => (
        <Link
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
        </Link>
      ))}
    </div>
  );
};
