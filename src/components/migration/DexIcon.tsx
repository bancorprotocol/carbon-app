import { FC, SVGProps } from 'react';
import { Dexes } from 'services/uniswap/utils';
import IconUniswap from 'assets/logos/uniswap.svg?react';
import IconSushiswap from 'assets/logos/sushiswap.svg?react';
import IconPancakeswap from 'assets/logos/pancakeswap.svg?react';

interface Props extends SVGProps<SVGSVGElement> {
  dex: Dexes;
}

export const DexIcon: FC<Props> = ({ dex, ...props }) => {
  if (dex === 'uniswap-v2' || dex === 'uniswap-v3') {
    return <IconUniswap {...props} />;
  }
  if (dex === 'sushi-v2' || dex === 'sushi-v3') {
    return <IconSushiswap {...props} />;
  }
  if (dex === 'pancake-v2' || dex === 'pancake-v3') {
    return <IconPancakeswap {...props} />;
  }
  return;
};
