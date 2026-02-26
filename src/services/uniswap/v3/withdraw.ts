import { Contract, Signer, TransactionRequest } from 'ethers';
import { UniswapV3Config } from '../utils';

// --- Configuration ---

// --- ABIs ---
const MANAGER_ABI = [
  // Read
  'function positions(uint256 tokenId) view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)',
  // Write
  'function decreaseLiquidity((uint256 tokenId, uint128 liquidity, uint256 amount0Min, uint256 amount1Min, uint256 deadline)) payable returns (uint256 amount0, uint256 amount1)',
  'function collect((uint256 tokenId, address recipient, uint128 amount0Max, uint128 amount1Max)) payable returns (uint256 amount0, uint256 amount1)',
  'function burn(uint256 tokenId) payable',
];

/**
 * 1. Removes 100% of liquidity
 * 2. Collects all tokens (principal + fees)
 * 3. Burns the NFT (deleting the position)
 */
export async function deleteAndWithdrawV3Position(
  config: UniswapV3Config,
  signer: Signer,
  tokenId: bigint | string,
) {
  const manager = new Contract(config.managerAddress, MANAGER_ABI, signer);
  const userAddress = await signer.getAddress();
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 mins

  const transactions: TransactionRequest[] = [];

  // 1. Fetch current liquidity
  // We need to know the exact amount to decrease
  const pos = await manager.positions(tokenId);
  const liquidity = pos.liquidity;

  // ---------------------------------------------------------
  // STEP A: Decrease Liquidity (If > 0)
  // ---------------------------------------------------------
  if (liquidity > 0n) {
    console.log(`- Step A: Decreasing ${liquidity} liquidity...`);

    // In production, calculate min amounts using slippage tolerance.
    // For now, we set 0 to ensure the tx succeeds for migration purposes.

    const txDecrease = await manager.decreaseLiquidity.populateTransaction({
      tokenId: tokenId,
      liquidity: liquidity,
      amount0Min: 0n,
      amount1Min: 0n,
      deadline: deadline,
    });
    transactions.push(txDecrease);
  }

  // ---------------------------------------------------------
  // STEP B: Collect All Tokens
  // ---------------------------------------------------------
  // We must collect MAX_UINT128 to ensure 'tokensOwed' becomes 0.
  // The Burn function will REVERT if there is even 1 wei left in the position.
  console.log(`- Step B: Collecting all fees and principal...`);

  const MAX_UINT128 = 340282366920938463463374607431768211455n;

  const collectParams = {
    tokenId: tokenId,
    recipient: userAddress,
    amount0Max: MAX_UINT128,
    amount1Max: MAX_UINT128,
  };

  const txCollect = await manager.collect.populateTransaction(collectParams);
  transactions.push(txCollect);

  // ---------------------------------------------------------
  // STEP C: Burn NFT
  // ---------------------------------------------------------
  console.log(`- Step C: Burning NFT...`);

  // This destroys the token ID. It allows the user to unclutter their wallet.
  const txBurn = await manager.burn.populateTransaction(tokenId);
  transactions.push(txBurn);

  return transactions;
}
