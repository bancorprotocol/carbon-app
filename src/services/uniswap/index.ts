import { Provider, Signer } from 'ethers';
import { Dexes, UniswapPosition } from './utils';
import { withdrawAllV2Liquidity } from './v2/withdraw';
import { deleteAndWithdrawV3Position } from './v3/withdraw';
import { getAllV2Positions } from './v2/read.contract';
import { getAllV3Positions } from './v3/read.contract';
import { Token } from 'libs/tokens';

export const uniV2Configs = {
  'sushi-v2': {
    dex: 'sushi-v2' as const,
    factoryAddress: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
    routerAddress: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
    startBlock: 10794229,
    fee: '3000',
  },
  'pancake-v2': {
    dex: 'pancake-v2' as const,
    factoryAddress: '0x1097053Fd2ea711dad45caCcc45EfF7548fCB362',
    routerAddress: '0xEfF92A263d31888d860bD50809A8D171709b7b1c',
    startBlock: 15614590,
    fee: '2500',
  },
  'uniswap-v2': {
    dex: 'uniswap-v2' as const,
    factoryAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    startBlock: 10000835,
    fee: '3000',
  },
};

export const uniV3Configs = {
  'sushi-v3': {
    dex: 'sushi-v3' as const,
    factoryAddress: '0xbACEB8eC6b9355Dfc0269C18bac9d6E2Bdc29C4F',
    managerAddress: '0x2214a42d8e2a1d20635c2cb0664422c528b6a432',
  },
  'pancake-v3': {
    dex: 'pancake-v3' as const,
    factoryAddress: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
    managerAddress: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
  },
  'uniswap-v3': {
    dex: 'uniswap-v3' as const,
    factoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    managerAddress: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  },
};

export async function getUniswapPositions(
  provider: Provider,
  userAddress: string,
  getTokenById: (address: string) => Token | undefined,
): Promise<UniswapPosition[]> {
  const normalizedUser = userAddress.toLowerCase();

  const allPositions: UniswapPosition[] = [];
  // TODO: this one can be parallelized because it's just calls
  for (const config of Object.values(uniV3Configs)) {
    const positions = await getAllV3Positions(
      config,
      provider,
      normalizedUser,
      getTokenById,
    );
    allPositions.push(...positions);
  }

  for (const config of Object.values(uniV2Configs)) {
    const positions = await getAllV2Positions(
      config,
      provider,
      normalizedUser,
      getTokenById,
    );
    allPositions.push(...positions);
  }

  return allPositions;
}

export async function withdrawPosition(
  signer: Signer,
  dex: Dexes,
  positionId: string,
) {
  const [name, version] = dex.split('-');
  if (version === 'v2') {
    const config = uniV2Configs[dex as keyof typeof uniV2Configs];
    return withdrawAllV2Liquidity(config, signer, positionId);
  } else {
    const config = uniV3Configs[dex as keyof typeof uniV3Configs];
    return deleteAndWithdrawV3Position(config, signer, positionId);
  }
}
