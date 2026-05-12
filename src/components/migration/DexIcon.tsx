import { FC, SVGProps } from 'react';
import { Dexes, DexesName } from 'services/uniswap/utils';
import IconUniswap from 'assets/logos/uniswap.svg?react';
import IconSushiswap from 'assets/logos/sushiswap.svg?react';
import IconPancakeswap from 'assets/logos/pancakeswap.svg?react';

interface Props extends SVGProps<SVGSVGElement> {
  dex: DexesName | Dexes;
}

export const DexIcon: FC<Props> = ({ dex, ...props }) => {
  if (dex.includes('uniswap')) {
    return <IconUniswap {...props} />;
  }
  if (dex.includes('sushi')) {
    return <IconSushiswap {...props} />;
  }
  if (dex.includes('pancake')) {
    return <IconPancakeswap {...props} />;
  }
  return;
};
