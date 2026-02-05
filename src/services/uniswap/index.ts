import { JsonRpcProvider, Signer } from 'ethers';
import { Dexes, UniswapPosition } from './utils';
import { withdrawAllV2Liquidity } from './v2/withdraw';
import { deleteAndWithdrawV3Position } from './v3/withdraw';
import { getAllV2Positions as getV2Dev } from './v2/read.dev';
import { getAllV2Positions as getV2Prod } from './v2/read.prod';
import { getAllV3Positions } from './v3/read.contract';
import { Token } from 'libs/tokens';

const getV2Positions = import.meta.env.DEV ? getV2Dev : getV2Prod;

export async function getUniswapPositions(
  provider: JsonRpcProvider,
  userAddress: string,
  getTokenById: (address: string) => Token | undefined,
): Promise<UniswapPosition[]> {
  const normalizedUser = userAddress.toLowerCase();

  // Run queries in parallel
  const [v2Positions, v3Positions] = await Promise.all([
    getV2Positions(provider, normalizedUser, getTokenById),
    getAllV3Positions(provider, normalizedUser, getTokenById),
  ]);

  return [...v2Positions, ...v3Positions];
}

export async function withdrawPosition(
  signer: Signer,
  dex: Dexes,
  positionId: string,
) {
  if (dex === 'uniswap-v2') {
    return withdrawAllV2Liquidity(signer, positionId);
  } else {
    return deleteAndWithdrawV3Position(signer, positionId);
  }
}
