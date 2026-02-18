import { Contract, id, Provider, zeroPadValue, formatUnits } from 'ethers';
import { DexesV2, UniswapPosition, UniswapV2Config } from '../utils';
import { Token } from 'libs/tokens';

// --- ABIs ---
// Minimal ABI to detect Transfer events and read Pair data
const ERC20_ABI = ['function decimals() view returns (uint8)'];

const PAIR_ABI = [
  'function balanceOf(address owner) view returns (uint)',
  'function token0() view returns (address)',
  'function token1() view returns (address)',
  'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function totalSupply() view returns (uint)',
  'function factory() view returns (address)', // Used for verification
];

const FACTORY_ABI = [
  'function getPair(address tokenA, address tokenB) view returns (address pair)',
];

const getSessionTokenPairs = (dex: DexesV2) => {
  const pairs = sessionStorage.getItem(`${dex}-token-pairs`);
  if (!pairs) return {};
  return JSON.parse(pairs);
};

const lastBlock = {
  'pancake-v2': 0,
  'uniswap-v2': 0,
  'sushi-v2': 0,
};
const tokenPairs: Record<DexesV2, Record<string, string[]>> = {
  'pancake-v2': getSessionTokenPairs('pancake-v2'),
  'uniswap-v2': getSessionTokenPairs('uniswap-v2'),
  'sushi-v2': getSessionTokenPairs('sushi-v2'),
};

/**
 * Discovers all Uniswap V2 positions for a user by scanning logs.
 * No external APIs (Covalent/TheGraph) required.
 */
export async function getAllV2Positions(
  config: UniswapV2Config,
  provider: Provider,
  userAddress: string,
  getTokenById: (address: string) => Token | undefined,
): Promise<UniswapPosition[]> {
  const positions: UniswapPosition[] = [];
  const factoryContract = new Contract(
    config.factoryAddress,
    FACTORY_ABI,
    provider,
  );

  // 1. SCAN LOGS (Discovery Phase)
  // We look for any 'Transfer' event where 'to' == userAddress.
  // This tells us every token the user has ever received.
  console.log(`Scanning logs for ERC20 activity...`);

  const transferTopic = id('Transfer(address,address,uint256)');
  const userTopic = zeroPadValue(userAddress, 32);

  const filter = {
    topics: [
      transferTopic,
      null, // 'from' - don't care
      userTopic, // 'to' - must be the user
    ],
    fromBlock: lastBlock[config.dex] || config.startBlock,
  };

  const blockNumber = await provider.getBlockNumber();
  const logs = await provider.getLogs(filter);

  // Extract unique contract addresses (potential pairs) from logs
  const potentialPairs = new Set<string>();
  for (const log of logs) {
    potentialPairs.add(log.address);
  }

  // Filter out pairs with tokens: if no tokens, the address is a regular ERC20 and not an LP token
  const getRealPairs = async (pairAddress: string) => {
    if (!tokenPairs[config.dex][pairAddress]) {
      try {
        // If this is a legit LP token, add its tokens to the list
        const pairContract = new Contract(pairAddress, PAIR_ABI, provider);
        const [t0, t1] = await Promise.all([
          pairContract.token0(),
          pairContract.token1(),
        ]);
        tokenPairs[config.dex][pairAddress] = [t0, t1];
      } catch (e) {
        // Else check if its a real error or just not an LP token
        const msg = (e as any)?.info?.error?.message;
        if (msg?.includes('Status: 429')) {
          // If this is a 429 error, throw to retry
          throw new Error(msg);
        } else {
          // If token0() call fails, it's just a regular token (like USDT), not a pair. Put it on the ignore list for later calls
          tokenPairs[config.dex][pairAddress] = []; // Empty pair
        }
      }
    }
  };

  // Batch requests to prevent 429 Too Many requests
  const potentialPairList = Array.from(potentialPairs);
  for (let i = 0; i < potentialPairs.size; i += 50) {
    const list = potentialPairList.slice(i, i + 50);
    const getAllRealPairs = Array.from(list).map(getRealPairs);
    await Promise.all(getAllRealPairs);
  }

  console.log(
    `Found ${potentialPairs.size} unique tokens interacted with. Verifying V2 Pairs...`,
  );

  const getTokenDecimals = (address: string) => {
    const token = getTokenById(address);
    if (token) return token.decimals;
    const contract = new Contract(address, ERC20_ABI, provider);
    return contract.decimals();
  };

  // 2. VERIFY & FETCH DATA
  // Check which of these tokens are actually Uniswap V2 pairs
  const getPosition = async (pairAddress: string) => {
    const pairContract = new Contract(pairAddress, PAIR_ABI, provider);
    const tokens = tokenPairs[config.dex][pairAddress];
    if (tokens.length !== 2)
      throw new Error('Should only have pair with 2 tokens');
    const [token0, token1] = tokens;

    // B. Security Check: Ask the Factory
    // Even if it has token0/token1, anyone can deploy a fake contract.
    // We ask the official Factory: "Is this address the real pair for these tokens?"
    const officialPair = await factoryContract.getPair(token0, token1);

    if (officialPair.toLowerCase() !== pairAddress.toLowerCase()) {
      // Not a legitimate Uniswap V2 Pair, reset tokens to empty array to ignore on next round
      tokenPairs[config.dex][pairAddress] = [];
      return;
    }

    // C. Get Balance & Reserves
    const balance: bigint = await pairContract.balanceOf(userAddress);

    if (balance > 0n) {
      const [reserves, totalSupply] = await Promise.all([
        pairContract.getReserves(),
        pairContract.totalSupply(),
      ]);

      const [dec0, dec1] = await Promise.all([
        getTokenDecimals(token0),
        getTokenDecimals(token1),
      ]);

      // D. Calculate Underlying Amounts
      // Formula: (UserLP / TotalSupply) * Reserve
      const amount0 = (balance * reserves.reserve0) / totalSupply;
      const amount1 = (balance * reserves.reserve1) / totalSupply;

      positions.push({
        id: pairAddress,
        dex: config.dex,
        base: token0,
        quote: token1,
        min: '0', // V2 is always 0 to Infinity
        max: 'Infinity',
        baseLiquidity: formatUnits(amount0, dec0),
        quoteLiquidity: formatUnits(amount1, dec1),
        baseFee: '0', // V2 fees are not separable; they increase the value of LP tokens
        quoteFee: '0',
        fee: config.fee,
      });
    }
  };
  const realPairs = Object.keys(tokenPairs[config.dex]).filter(
    (address) => tokenPairs[config.dex][address].length === 2,
  );
  const getAllPosition = realPairs.map(getPosition);
  await Promise.all(getAllPosition);

  lastBlock[config.dex] = blockNumber;
  sessionStorage.setItem(
    `${config.dex}-token-pairs`,
    JSON.stringify(tokenPairs[config.dex]),
  );

  return positions;
}
