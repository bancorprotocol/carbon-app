import {
  Contract,
  parseUnits,
  Signer,
  TransactionRequest,
  ZeroAddress,
} from 'ethers';
import { Token, Percent } from '@uniswap/sdk-core';
import {
  Pool,
  Position,
  nearestUsableTick,
  TICK_SPACINGS,
  FeeAmount,
  encodeSqrtRatioX96,
} from '@uniswap/v3-sdk';
import { SafeDecimal } from 'libs/safedecimal';

// --- Configuration ---
const POSITION_MANAGER_ADDRESS = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88'; // Mainnet
const FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';

// --- Minimal ABIs ---
const ERC20_ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

const MANAGER_ABI = [
  'function mint((address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, address recipient, uint256 deadline)) payable returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)',
];

const POOL_ABI = [
  'function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
  'function liquidity() view returns (uint128)',
];

const FACTORY_ABI = [
  'function getPool(address tokenA, address tokenB, uint24 fee) view returns (address pool)',
  'function createPool(address tokenA, address tokenB, uint24 fee) returns (address pool)',
];

/**
 * Creates a new Uniswap V3 Position (Mint NFT).
 * @param signer - The ether.js signer
 * @param token0 - Address of the first token (must be sorted or function will sort)
 * @param token1 - Address of the second token
 * @param amount0 - Amount of Token0 to add (BigInt)
 * @param amount1 - Amount of Token1 to add (BigInt)
 * @param fee - The pool fee tier (e.g. 3000 for 0.3%)
 * @param tickLower - The lower bound tick of your range
 * @param tickUpper - The upper bound tick of your range
 */
export async function createV3Position(
  signer: Signer,
  token0: string,
  token1: string,
  amount0: bigint,
  amount1: bigint,
  fee: number = 3000, // e.g. 500, 3000, 10000
): Promise<TransactionRequest> {
  const provider = signer.provider!;
  const userAddress = await signer.getAddress();
  const manager = new Contract(POSITION_MANAGER_ADDRESS, MANAGER_ABI, signer);

  console.log(`Preparing to mint V3 Position...`);

  // 1. Sort Tokens (Uniswap V3 requires token0 < token1)
  // If inputs are not sorted, we swap them to match the pool structure
  let t0 = token0;
  let t1 = token1;
  let amt0 = amount0;
  let amt1 = amount1;

  if (t0.toLowerCase() > t1.toLowerCase()) {
    [t0, t1] = [t1, t0];
    [amt0, amt1] = [amt1, amt0];
  }

  // 3. Get Pool State (Needed to calculate Slippage/MinAmounts)
  // We need the current sqrtPrice to calculate how much liquidity the amounts generate
  const factory = new Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
  const poolAddress = await factory.getPool(t0, t1, fee);

  if (poolAddress === ZeroAddress) {
    const price = new SafeDecimal(amt0.toString())
      .div(t1.toString())
      .toNumber();
    await createAndInitializePool(signer, t0, t1, fee, price);
  }

  const poolContract = new Contract(poolAddress, POOL_ABI, provider);
  const [slot0, liquidity] = await Promise.all([
    poolContract.slot0(),
    poolContract.liquidity(),
  ]);
  const { tickLower, tickUpper } = getTicksFromRange(
    Number(slot0.tick),
    fee,
    0.1,
  );

  // 4. Use SDK to calculate accurate Liquidity & MinAmounts
  // This is safer than doing raw math because of V3's complex Q64.96 fixed point math
  const chainId = 1; // Assuming Mainnet, change if needed

  // Create SDK Token instances (fetch decimals on-chain for correctness)
  const t0Contract = new Contract(t0, ERC20_ABI, provider);
  const t1Contract = new Contract(t1, ERC20_ABI, provider);
  const [d0, d1] = await Promise.all([
    t0Contract.decimals(),
    t1Contract.decimals(),
  ]);

  const TokenA = new Token(chainId, t0, Number(d0));
  const TokenB = new Token(chainId, t1, Number(d1));

  // Construct SDK Pool
  const poolSdk = new Pool(
    TokenA,
    TokenB,
    fee,
    slot0.sqrtPriceX96.toString(),
    liquidity.toString(),
    Number(slot0.tick),
  );

  // Construct SDK Position
  // This automatically calculates how much liquidity you get for your amounts
  const positionSdk = Position.fromAmounts({
    pool: poolSdk,
    tickLower: tickLower,
    tickUpper: tickUpper,
    amount0: amt0.toString(),
    amount1: amt1.toString(),
    useFullPrecision: true,
  });

  // Calculate Min Amounts (0.5% Slippage)
  // slippageTolerance: 50/10000 = 0.5%
  const mintOptions = {
    slippageTolerance: new Percent(50, 10_000),
    recipient: userAddress,
    deadline: Math.floor(Date.now() / 1000) + 60 * 20,
  };

  // Get minimums based on slippage
  const { amount0: amount0Min, amount1: amount1Min } =
    positionSdk.mintAmountsWithSlippage(mintOptions.slippageTolerance);

  // 5. Execute Mint Transaction
  console.log(`Minting Position...`);
  console.log(`Liquidity: ${positionSdk.liquidity.toString()}`);
  console.log(
    `Min0: ${amount0Min.toString()} / Min1: ${amount1Min.toString()}`,
  );

  const params = {
    token0: t0,
    token1: t1,
    fee: fee,
    tickLower: tickLower,
    tickUpper: tickUpper,
    amount0Desired: amt0,
    amount1Desired: amt1,
    amount0Min: BigInt(amount0Min.toString()),
    amount1Min: BigInt(amount1Min.toString()),
    recipient: userAddress,
    deadline: mintOptions.deadline,
  };

  const unsignedTx = await manager.mint.populateTransaction(params);
  unsignedTx.customData = {
    spender: POSITION_MANAGER_ADDRESS,
    assets: [
      {
        address: t0,
        rawAmount: amount0Min.toString(),
      },
      {
        address: t1,
        rawAmount: amount1Min.toString(),
      },
    ],
  };
  return unsignedTx;
}

/**
 * Helper to get Ticks from a price range
 * @param centerTick The current tick of the pool (from slot0)
 * @param fee The fee tier (needed for tick spacing)
 * @param widthPercentage How wide the range should be (e.g. 0.10 for +/- 10%)
 */
export function getTicksFromRange(
  centerTick: number,
  fee: FeeAmount,
  widthPercentage: number,
) {
  const space = TICK_SPACINGS[fee];

  // Calculate raw ticks based on percentage deviation
  // This is a rough approximation. For precise price targets, use log logic.
  // tick = log_1.0001(price)
  const delta = Math.floor(Math.log(1 + widthPercentage) / Math.log(1.0001));

  const tickLowerRaw = centerTick - delta;
  const tickUpperRaw = centerTick + delta;

  return {
    tickLower: nearestUsableTick(tickLowerRaw, space),
    tickUpper: nearestUsableTick(tickUpperRaw, space),
  };
}

/**
 * Creates a new Uniswap V3 Pool and initializes it with a starting price.
 * * @param signer - The ethers.js signer
 * @param token0 - First token address
 * @param token1 - Second token address
 * @param fee - Fee tier (500, 3000, 10000)
 * @param initialPrice - The starting price of Token0 in terms of Token1 (e.g., "3000" if 1 Token0 = 3000 Token1)
 */
export async function createAndInitializePool(
  signer: Signer,
  token0: string,
  token1: string,
  fee: number,
  initialPrice: number,
): Promise<string> {
  const factory = new Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);

  console.log('Checking if pool exists...');

  // 1. Check if pool already exists
  let poolAddress = await factory.getPool(token0, token1, fee);

  if (poolAddress !== ZeroAddress) {
    console.log(`Pool already exists at ${poolAddress}`);
    return poolAddress;
  }

  // 2. Sort Tokens (Required for correct price calculation)
  // Uniswap requires token0 < token1. If our inputs are backwards,
  // we must invert the price because 1 T0 = 3000 T1 implies 1 T1 = 1/3000 T0.
  const token0Sorted =
    token0.toLowerCase() < token1.toLowerCase() ? token0 : token1;
  const token1Sorted =
    token0.toLowerCase() < token1.toLowerCase() ? token1 : token0;

  let priceToEncode = initialPrice;

  if (token0.toLowerCase() !== token0Sorted.toLowerCase()) {
    // If we swapped the token order, we must invert the price
    // Example: User said 1 ETH = 3000 USDC.
    // If ETH is token1 (numerically higher), we need price of USDC in ETH (1/3000).
    priceToEncode = 1 / initialPrice;
    console.log(`Token order swapped. Inverting price to: ${priceToEncode}`);
  }

  // 3. Create the Pool
  console.log('Creating pool...');
  const createTx = await factory.createPool(token0Sorted, token1Sorted, fee);
  await createTx.wait();

  // Fetch the new address
  poolAddress = await factory.getPool(token0Sorted, token1Sorted, fee);
  console.log(`Pool created at: ${poolAddress}`);

  console.log(priceToEncode, parseUnits(priceToEncode.toString(), 18));

  // 4. Initialize the Pool (Set Starting Price)
  // We use the SDK helper to convert a simple number (3000) to the Q64.96 format required by the contract
  // Note: Standard 'encodeSqrtRatioX96' expects amount1/amount0.
  // To simulate price "P", we say we have "P" of amount1 and "1" of amount0.
  const sqrtPriceX96 = encodeSqrtRatioX96(
    parseUnits(priceToEncode.toString(), 18).toString(),
    parseUnits('1', 18).toString(),
  );

  const poolContract = new Contract(poolAddress, POOL_ABI, signer);
  console.log(`Initializing pool with price ${priceToEncode}...`);

  const initTx = await poolContract.initialize(sqrtPriceX96.toString());
  await initTx.wait();

  console.log('Pool initialized successfully.');
  return poolAddress;
}
