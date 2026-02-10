import { Contract, id, Provider, zeroPadValue, formatUnits } from 'ethers';
import { UniswapPosition, UniswapV2Config } from '../utils';
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
    fromBlock: config.startBlock,
  };

  const logs = await provider.getLogs(filter);

  // Extract unique contract addresses (potential pairs) from logs
  const potentialPairs = new Set<string>();
  logs.forEach((log) => potentialPairs.add(log.address));

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
    try {
      const pairContract = new Contract(pairAddress, PAIR_ABI, provider);

      // A. Quick check: Does it identify as a pair?
      // Calling token0() is a cheap way to filter out standard tokens like USDC which don't have this method.
      // If this reverts, it's not a pair.
      const [token0, token1] = await Promise.all([
        pairContract.token0(),
        pairContract.token1(),
      ]);

      const [dec0, dec1] = await Promise.all([
        getTokenDecimals(token0),
        getTokenDecimals(token1),
      ]);

      // B. Security Check: Ask the Factory
      // Even if it has token0/token1, anyone can deploy a fake contract.
      // We ask the official Factory: "Is this address the real pair for these tokens?"
      const officialPair = await factoryContract.getPair(token0, token1);

      if (officialPair.toLowerCase() !== pairAddress.toLowerCase()) {
        return; // Not a legitimate Uniswap V2 Pair
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
    } catch (e) {
      // If token0() call fails, it's just a regular token (like USDT), not a pair. Ignore it.
    }
  };
  const getAllPosition = Array.from(potentialPairs).map(getPosition);
  await Promise.all(getAllPosition);

  return positions;
}
