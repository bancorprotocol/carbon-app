import { Contract, id, Provider, zeroPadValue } from 'ethers';
import { UniswapPosition } from '../utils';

// --- Configuration ---
const V2_FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';

// --- ABIs ---
// Minimal ABI to detect Transfer events and read Pair data
const ERC20_TRANSFER_ABI = [
  'event Transfer(address indexed from, address indexed to, uint256 value)',
];

const V2_PAIR_ABI = [
  'function balanceOf(address owner) view returns (uint)',
  'function token0() view returns (address)',
  'function token1() view returns (address)',
  'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function totalSupply() view returns (uint)',
  'function factory() view returns (address)', // Used for verification
];

const V2_FACTORY_ABI = [
  'function getPair(address tokenA, address tokenB) view returns (address pair)',
];

/**
 * Discovers all Uniswap V2 positions for a user by scanning logs.
 * No external APIs (Covalent/TheGraph) required.
 */
export async function getAllV2Positions(
  provider: Provider,
  userAddress: string,
  fromBlock: number = -100000, // Defaults to scanning last 100k blocks. Set to 0 for full history (slow).
): Promise<UniswapPosition[]> {
  const positions: UniswapPosition[] = [];
  const factoryContract = new Contract(
    V2_FACTORY_ADDRESS,
    V2_FACTORY_ABI,
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
    fromBlock: fromBlock >= 0 ? fromBlock : 'earliest', // Be careful with 'earliest' on public RPCs
  };

  const logs = await provider.getLogs(filter);

  // Extract unique contract addresses (potential pairs) from logs
  const potentialPairs = new Set<string>();
  logs.forEach((log) => potentialPairs.add(log.address));

  console.log(
    `Found ${potentialPairs.size} unique tokens interacted with. Verifying V2 Pairs...`,
  );

  // 2. VERIFY & FETCH DATA
  // Check which of these tokens are actually Uniswap V2 pairs
  for (const pairAddress of potentialPairs) {
    try {
      const pairContract = new Contract(pairAddress, V2_PAIR_ABI, provider);

      // A. Quick check: Does it identify as a pair?
      // Calling token0() is a cheap way to filter out standard tokens like USDC which don't have this method.
      // If this reverts, it's not a pair.
      const [token0, token1] = await Promise.all([
        pairContract.token0(),
        pairContract.token1(),
      ]);

      // B. Security Check: Ask the Factory
      // Even if it has token0/token1, anyone can deploy a fake contract.
      // We ask the official Factory: "Is this address the real pair for these tokens?"
      const officialPair = await factoryContract.getPair(token0, token1);

      if (officialPair.toLowerCase() !== pairAddress.toLowerCase()) {
        continue; // Not a legitimate Uniswap V2 Pair
      }

      // C. Get Balance & Reserves
      const balance: bigint = await pairContract.balanceOf(userAddress);

      if (balance > 0n) {
        const [reserves, totalSupply] = await Promise.all([
          pairContract.getReserves(),
          pairContract.totalSupply(),
        ]);

        // D. Calculate Underlying Amounts
        // Formula: (UserLP / TotalSupply) * Reserve
        const amount0 = (balance * reserves.reserve0) / totalSupply;
        const amount1 = (balance * reserves.reserve1) / totalSupply;

        positions.push({
          id: pairAddress,
          dex: 'uniswap-v2',
          base: token0,
          quote: token1,
          min: '0', // V2 is always 0 to Infinity
          max: 'Infinity',
          baseLiquidity: amount0.toString(),
          quoteLiquidity: amount1.toString(),
          baseFee: '0', // V2 fees are not separable; they increase the value of LP tokens
          quoteFee: '0',
          fee: '3000', // Hardcoded 0.3%
        });
      }
    } catch (e) {
      // If token0() call fails, it's just a regular token (like USDT), not a pair. Ignore it.
    }
  }

  return positions;
}
