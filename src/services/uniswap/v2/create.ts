import {
  Contract,
  MaxUint256,
  Signer,
  TransactionRequest,
  ZeroAddress,
} from 'ethers';
import { UniswapV2Config } from '../utils';

// --- Configuration ---

const ROUTER_ABI = [
  'function addLiquidity(address token1, address token2, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) returns (uint amountA, uint amountB, uint liquidity)',
];

const PAIR_ABI = [
  'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function token0() view returns (address)',
];

const FACTORY_ABI = [
  'function getPair(address token1, address token2) view returns (address pair)',
  'function createPair(address tokenA, address tokenB) returns (address pair)',
  'event PairCreated(address indexed token0, address indexed token1, address pair, uint)',
];

const ERC20_ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
];

/**
 * Creates a new Uniswap V2 position (Adds Liquidity).
 * Automatically handles Token Approvals and Slippage calculations.
 */
export async function createV2Position(
  config: UniswapV2Config,
  signer: Signer,
  base: string,
  quote: string,
  amount1: bigint,
  slippagePercent: number = 0.5,
): Promise<TransactionRequest> {
  const router = new Contract(config.routerAddress, ROUTER_ABI, signer);
  const factory = new Contract(config.factoryAddress, FACTORY_ABI, signer);
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
    spender: config.routerAddress,
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

/**
 * Creates a V2 Pool (if needed) and adds INITIAL liquidity to set the price.
 * * @param tokenA - First token address
 * @param tokenB - Second token address
 * @param amountA - Amount of Token A to deposit
 * @param amountB - Amount of Token B to deposit
 */
export async function createAndInitializeV2Pool(
  config: UniswapV2Config,
  signer: Signer,
  tokenA: string,
  tokenB: string,
  amountA: bigint,
  amountB: bigint,
) {
  const provider = signer.provider!;
  const userAddress = await signer.getAddress();
  const router = new Contract(config.routerAddress, ROUTER_ABI, signer);
  const factory = new Contract(config.factoryAddress, FACTORY_ABI, provider);

  console.log(`Preparing to initialize V2 Pool...`);

  // 1. Safety Check: Does the pool already have liquidity?
  // If reserves > 0, the price is already set. We cannot "initialize" it with our own ratio.
  const pairAddress = await factory.getPair(tokenA, tokenB);

  if (pairAddress !== ZeroAddress) {
    const pair = new Contract(pairAddress, PAIR_ABI, provider);
    const reserves = await pair.getReserves();

    if (reserves.reserve0 > 0n || reserves.reserve1 > 0n) {
      throw new Error(
        "Pool already has liquidity! Use the standard 'addLiquidity' function to avoid losing money.",
      );
    }
    console.log(`Pool exists at ${pairAddress} but is empty. Proceeding.`);
  } else {
    console.log(`Pool does not exist. It will be created automatically.`);
  }

  // 2. Approve Router
  // We must approve the Router to spend our tokens
  await checkAndApprove(config, signer, tokenA, amountA);
  await checkAndApprove(config, signer, tokenB, amountB);

  // 3. Add Liquidity
  // Since this is the FIRST liquidity, min amounts can be slightly lower (e.g. 98%)
  // or exactly equal if we want to be strict.
  // The ratio of amountA / amountB determines the initial price.
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

  console.log(`Adding Initial Liquidity: ${amountA} / ${amountB}`);

  // Note: automatic creation happens inside this call if pair is missing
  const tx = await router.addLiquidity(
    tokenA,
    tokenB,
    amountA,
    amountB,
    amountA, // Min A (Strict: Don't accept less than we put in for initial)
    amountB, // Min B
    userAddress,
    deadline,
  );

  console.log(`Pool Initialized! Tx: ${tx.hash}`);
  return tx;
}

// --- Helper ---
async function checkAndApprove(
  config: UniswapV2Config,
  signer: Signer,
  token: string,
  amount: bigint,
) {
  const contract = new Contract(token, ERC20_ABI, signer);
  const user = await signer.getAddress();
  const allowance = await contract.allowance(user, config.routerAddress);

  if (allowance < amount) {
    console.log(`Approving ${token}...`);
    const tx = await contract.approve(config.routerAddress, MaxUint256);
    await tx.wait();
  }
}
