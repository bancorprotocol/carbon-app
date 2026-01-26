import { Provider, Signer } from 'ethers';
import { Dexes, UniswapPosition } from './utils';
import { withdrawAllV2Liquidity } from './v2/withdraw';
import { deleteAndWithdrawV3Position } from './v3/withdraw';
import { getAllV2Positions } from './v2/read.contract';
import { getAllV3Positions } from './v3/read.contract';

export async function getUniswapPositions(
  provider: Provider,
  userAddress: string,
): Promise<UniswapPosition[]> {
  const normalizedUser = userAddress.toLowerCase();

  // Run queries in parallel
  const [v2Positions, v3Positions] = await Promise.all([
    getAllV2Positions(provider, normalizedUser),
    getAllV3Positions(provider, normalizedUser),
    // fetchV2PositionsGraph(normalizedUser),
    // fetchV3PositionsGraph(provider, normalizedUser),
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
