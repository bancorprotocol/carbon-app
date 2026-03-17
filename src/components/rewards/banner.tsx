import { Fragment } from 'react';
import Tac from 'assets/logos/taclogo.svg?react';
import Coti from 'assets/logos/cotilogo.svg?react';
import Celo from 'assets/logos/celologo.svg?react';
import OpenTabIcon from 'assets/icons/link.svg?react';
import { NewTabLink } from 'libs/routing';
import { RewardIcon } from './icon';

const links = [
  {
    icon: <Coti className="size-16" />,
    url: 'https://coti.carbondefi.xyz/explore/pairs?filter=rewards',
    label: 'Coti chain',
  },
  {
    icon: <Tac className="size-16" />,
    url: 'https://tac.carbondefi.xyz/explore/pairs?filter=rewards',
    label: 'TAC chain',
  },
  {
    icon: <Celo className="size-16" />,
    url: 'https://celo.carbondefi.xyz/explore/pairs?filter=rewards',
    label: 'Celo chain',
  },
];

export const RewardBanner = () => {
  return (
    <div
      role="banner"
      className="grid place-items-center gap-16 p-16 font-title bg-gradient-to-r from-reward/80 to-reward-dark/80 border-reward-dark border-y-2"
    >
      <h2 className="flex items-center gap-8 font-bold text-24">
        Join One of the Active Rewards (Yield farming) Programs
        <RewardIcon className="size-20" />
      </h2>
      <nav
        aria-label="redirect to reward page"
        className="flex items-center gap-16"
      >
        {links.map(({ url, label, icon }, i) => (
          <Fragment key={url}>
            {!!i && <hr className="w-1 h-16 bg-main-0" />}
            <NewTabLink to={url} className="flex items-center gap-8">
              {icon}
              {label}
              <OpenTabIcon className="size-16" />
            </NewTabLink>
          </Fragment>
        ))}
      </nav>
    </div>
  );
};
