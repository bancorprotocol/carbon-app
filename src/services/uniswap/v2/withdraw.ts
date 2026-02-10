import { Contract, Signer, MaxUint256, TransactionRequest } from 'ethers';
import { UniswapV2Config } from '../utils';

// --- Configuration ---

// --- Minimal ABIs ---
const ROUTER_ABI = [
  'function removeLiquidity(address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline) returns (uint amountA, uint amountB)',
];

const PAIR_ABI = [
  'function balanceOf(address owner) view returns (uint)',
  'function token0() view returns (address)',
  'function token1() view returns (address)',
  'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function totalSupply() view returns (uint)',
  'function allowance(address owner, address spender) view returns (uint)',
  'function approve(address spender, uint value) returns (bool)',
];

/**
 * Withdraws 100% of the liquidity held by the signer in a specific Uniswap V2 Pair.
 * Automatically calculates 'min' amounts based on a slippage tolerance.
 */
export async function withdrawAllV2Liquidity(
  config: UniswapV2Config,
  signer: Signer,
  pairAddress: string,
  slippagePercent: number = 0.5, // Default 0.5% slippage protection
): Promise<TransactionRequest[]> {
  const provider = signer.provider;
  if (!provider) throw new Error('Signer must have a provider connected.');

  const userAddress = await signer.getAddress();
  const pairContract = new Contract(pairAddress, PAIR_ABI, signer);
  const routerContract = new Contract(config.routerAddress, ROUTER_ABI, signer);

  // 1. Get User's Full LP Balance
  const lpBalance: bigint = await pairContract.balanceOf(userAddress);

  if (lpBalance === 0n) {
    console.warn('No liquidity found to withdraw.');
    return [];
  }

  // 2. Fetch Pool Data for Calculation
  const [token0, token1, reserves, totalSupply] = await Promise.all([
    pairContract.token0(),
    pairContract.token1(),
    pairContract.getReserves(),
    pairContract.totalSupply(),
  ]);

  // 3. Calculate Expected Amounts & Min Amounts (Slippage Protection)
  // Formula: Share = (UserLP / TotalLP)
  // Amount = Reserve * Share
  const expectedAmount0 = (lpBalance * BigInt(reserves.reserve0)) / totalSupply;
  const expectedAmount1 = (lpBalance * BigInt(reserves.reserve1)) / totalSupply;

  // Apply Slippage: min = expected * (1 - slippage/100)
  // We use 10000 as base for precision (0.5% = 50 basis points)
  const basisPoints = BigInt(Math.floor(slippagePercent * 100));
  const minAmount0 = (expectedAmount0 * (10000n - basisPoints)) / 10000n;
  const minAmount1 = (expectedAmount1 * (10000n - basisPoints)) / 10000n;

  const transactions: TransactionRequest[] = [];

  // 4. Handle Approval
  const allowance: bigint = await pairContract.allowance(
    userAddress,
    config.routerAddress,
  );
  if (allowance < lpBalance) {
    const approveTx = await pairContract.approve.populateTransaction(
      config.routerAddress,
      MaxUint256,
    );
    transactions.push(approveTx);
  }

  // 5. Execute Withdrawal
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

  const unsignedTx = await routerContract.removeLiquidity.populateTransaction(
    token0,
    token1,
    lpBalance,
    minAmount0,
    minAmount1,
    userAddress,
    deadline,
  );
  transactions.push(unsignedTx);

  return transactions;
}
