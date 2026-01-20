import { Provider, Signer } from 'ethers';
import { UniswapPosition } from './utils';
import { fetchV3PositionsGraph } from './v3/read';
import { withdrawAllV2Liquidity } from './v2/withdraw';
import { deleteAndWithdrawV3Position } from './v3/withdraw';
import { getAllV2Positions } from './v2/read.contract';

export async function getUniswapPositions(
  provider: Provider,
  userAddress: string,
): Promise<UniswapPosition[]> {
  const normalizedUser = userAddress.toLowerCase();

  // Run queries in parallel
  const [v2Positions, v3Positions] = await Promise.all([
    getAllV2Positions(provider, normalizedUser),
    // fetchV2PositionsGraph(normalizedUser),
    fetchV3PositionsGraph(provider, normalizedUser),
  ]);

  return [...v2Positions, ...v3Positions];
}

export async function withdrawPosition(
  signer: Signer,
  position: UniswapPosition,
) {
  if (position.dex === 'uniswap-v2') {
    return withdrawAllV2Liquidity(signer, position.id);
  } else {
    return deleteAndWithdrawV3Position(signer, position.id);
  }
}
