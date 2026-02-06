import { FC, SVGProps } from 'react';
import { Dexes } from 'services/uniswap/utils';
import IconUniswap from 'assets/logos/uniswap.svg?react';

interface Props extends SVGProps<SVGSVGElement> {
  dex: Dexes;
}

export const DexIcon: FC<Props> = ({ dex, ...props }) => {
  if (dex === 'uniswap-v2' || dex === 'uniswap-v3') {
    return <IconUniswap {...props} />;
  }
  return;
};
