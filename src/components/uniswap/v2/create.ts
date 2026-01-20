import { Contract, Signer, TransactionRequest, ZeroAddress } from 'ethers';

// --- Configuration ---
const ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';

const ROUTER_ABI = [
  'function addLiquidity(address token1, address token2, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) returns (uint amountA, uint amountB, uint liquidity)',
];

const PAIR_ABI = [
  'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function token0() view returns (address)',
];

const FACTORY_ABI = [
  'function getPair(address token1, address token2) view returns (address pair)',
];
/**
 * Creates a new Uniswap V2 position (Adds Liquidity).
 * Automatically handles Token Approvals and Slippage calculations.
 */
export async function createV2Position(
  signer: Signer,
  base: string,
  quote: string,
  amount1: bigint,
  slippagePercent: number = 0.5,
): Promise<TransactionRequest> {
  const router = new Contract(ROUTER_ADDRESS, ROUTER_ABI, signer);
  const factory = new Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);
  const userAddress = await signer.getAddress();
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 mins

  console.log(`Preparing to add liquidity for ${amount1} of Token A...`);

  // 1. Fetch Pair & Reserves
  const pairAddress = await factory.getPair(base, quote);

  if (pairAddress === ZeroAddress) {
    throw new Error(
      'Pool does not exist. Cannot calculate Token B amount automatically.',
    );
  }

  const pair = new Contract(pairAddress, PAIR_ABI, signer);
  const [reserves, token0] = await Promise.all([
    pair.getReserves(),
    pair.token0(),
  ]);

  // 2. Match Reserves to Tokens
  // reserves array is [reserve0, reserve1]
  // We need to know which one corresponds to our 'token1'
  const isTokenA0 = base.toLowerCase() === token0.toLowerCase();
  const reserveA = isTokenA0 ? reserves.reserve0 : reserves.reserve1;
  const reserveB = isTokenA0 ? reserves.reserve1 : reserves.reserve0;

  // 3. Calculate Required Token B
  // Formula: amountB = amountA * (reserveB / reserveA)
  if (reserveA === 0n)
    throw new Error('Pool has no liquidity. Cannot calculate price.');

  const amount2 = (amount1 * BigInt(reserveB)) / BigInt(reserveA);

  console.log(
    `Price calculated: Need ${amount2} of Token B to match ${amount1} of Token A.`,
  );

  console.log(
    `Creating V2 Position: ${amount1} of ${base} + ${amount2} of ${quote}`,
  );

  // ---------------------------------------------------------
  // STEP 2: Calculate Min Amounts (Slippage)
  // ---------------------------------------------------------
  // Min = Desired * (1 - slippage/100)
  // We use 10000 as a basis (0.5% = 50 basis points)
  const factor = 10000n - BigInt(Math.floor(slippagePercent * 100));
  const amount1Min = (amount1 * factor) / 10000n;
  const amount2Min = (amount2 * factor) / 10000n;

  // ---------------------------------------------------------
  // STEP 3: Add Liquidity
  // ---------------------------------------------------------
  // Note: This function creates the Pair contract automatically if it doesn't exist.
  const tx = await router.addLiquidity.populateTransaction(
    base,
    quote,
    amount1,
    amount2,
    amount1Min,
    amount2Min,
    userAddress, // Liquidity tokens (LP) sent to user
    deadline,
  );
  tx.customData = {
    spender: ROUTER_ADDRESS,
    assets: [
      {
        address: base,
        rawAmount: amount1.toString(),
      },
      {
        address: quote,
        rawAmount: amount2.toString(),
      },
    ],
  };

  return tx;
}
