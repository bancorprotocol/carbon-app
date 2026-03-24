import { Fragment, useMemo } from 'react';
import Tac from 'assets/logos/taclogo.svg?react';
import Coti from 'assets/logos/cotilogo.svg?react';
import Celo from 'assets/logos/celologo.svg?react';
import Eth from 'assets/logos/ethlogo.svg?react';
import Sei from 'assets/logos/seilogo.svg?react';
import Ton from 'assets/logos/tonlogo.svg?react';
import { RewardIcon } from './icon';
import { useAllChainRewards } from 'libs/queries/extApi/rewards';
import { Loading } from 'components/common/Loading';

const links = {
  coti: {
    icon: <Coti className="size-16" />,
    url: 'https://coti.carbondefi.xyz/explore/pairs?filter=rewards',
    label: 'Coti chain',
  },
  tac: {
    icon: <Tac className="size-16" />,
    url: 'https://tac.carbondefi.xyz/explore/pairs?filter=rewards',
    label: 'TAC chain',
  },
  celo: {
    icon: <Celo className="size-16" />,
    url: 'https://celo.carbondefi.xyz/explore/pairs?filter=rewards',
    label: 'Celo chain',
  },
  ethereum: {
    icon: <Eth className="size-16" />,
    url: 'https://app.carbondefi.xyz/explore/pairs?filter=rewards',
    label: 'Ethereum chain',
  },
  sei: {
    icon: <Sei className="size-16" />,
    url: 'https://sei.carbondefi.xyz/explore/pairs?filter=rewards',
    label: 'Sei chain',
  },
  ton: {
    icon: <Ton className="size-16" />,
    url: 'https://ton.carbondefi.xyz/explore/pairs?filter=rewards',
    label: 'Ton chain',
  },
};

export const RewardBanner = () => {
  const rewardsQuery = useAllChainRewards();
  const list = useMemo(() => {
    if (!rewardsQuery.data) return;
    return rewardsQuery.data
      ?.filter(([_, rewards]) => !!rewards.length)
      .map(([network, _]) => links[network]);
  }, [rewardsQuery.data]);

  if (!list) {
    return (
      <div role="banner" className="grid place-items-center gap-16 p-16">
        <Loading width="55ch" height="36px" />
        <Loading width="16ch" height="33px" />
      </div>
    );
  }
  if (!list.length) return;
  return (
    <div
      role="banner"
      className="grid place-items-center gap-16 p-16 font-title bg-gradient-to-r from-reward/80 to-reward-dark/80 border-reward-dark border-y-2"
    >
      <h2 className="flex justify-center items-center gap-8 text-center font-medium text-20 sm:text-24">
        <RewardIcon className="hidden sm:block size-20" />
        Earn Rewards - Join an active yield farming campaign
      </h2>
      <nav
        aria-label="redirect to reward page"
        className="flex items-center gap-16"
      >
        {list.map(({ url, label, icon }, i) => (
          <Fragment key={url}>
            {!!i && <hr className="w-1 h-16 bg-main-0" />}
            <a
              href={url}
              className="flex items-center gap-8 px-8 py-4 border border-main-0/40 rounded-md bg-main-0/10 hover:bg-main-0/20"
            >
              {icon}
              {label}
            </a>
          </Fragment>
        ))}
      </nav>
    </div>
  );
};
