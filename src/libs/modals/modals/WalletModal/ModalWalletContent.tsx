import { Imager } from 'components/common/imager/Imager';
import { FC } from 'react';
import iconLedger from 'assets/logos/ledger.svg';
import iconTrezor from 'assets/logos/trezor.svg';
import { Connection, SELECTABLE_CONNECTION_TYPES } from 'libs/web3';
import { getConnection } from 'libs/web3/web3.utils';
import { Link } from 'libs/routing';

type Props = {
  onClick: (c: Connection) => Promise<void>;
};

const textClasses = 'text-16 font-weight-500';
const buttonClasses =
  'flex h-44 w-full items-center space-x-16 rounded-8 px-10 hover:bg-black';

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

export const ModalWalletContent: FC<Props> = ({ onClick }) => {
  return (
    <div className={'space-y-10'}>
      {SELECTABLE_CONNECTION_TYPES.map(getConnection).map((c) => (
        <button
          key={c.type}
          onClick={() => onClick(c)}
          className={buttonClasses}
        >
          <Imager alt={'Wallet Logo'} src={c.logoUrl} className={'w-24'} />
          <span className={textClasses}>{c.name}</span>
        </button>
      ))}

      {EXT_LINKS.map(({ url, name, logoUrl }) => (
        <Link key={url} to={url} className={buttonClasses}>
          <div className={'flex w-24 justify-center'}>
            <Imager alt={'Wallet Logo'} src={logoUrl} className={'h-24'} />
          </div>
          <span className={textClasses}>{name}</span>
        </Link>
      ))}
    </div>
  );
};
