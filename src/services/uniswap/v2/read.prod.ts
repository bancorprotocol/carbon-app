import { Contract, formatUnits, JsonRpcProvider } from 'ethers';
import { UniswapPosition } from '../utils';
import { Token } from 'libs/tokens';

// --- Configuration ---
const V2_FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';

// --- ABIs ---
const V2_PAIR_ABI = [
  'function token0() view returns (address)',
  'function token1() view returns (address)',
  'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function totalSupply() view returns (uint)',
  'function symbol() view returns (string)', // Useful for quick filtering
];

const V2_FACTORY_ABI = [
  'function getPair(address tokenA, address tokenB) view returns (address pair)',
];

const ERC20_ABI = ['function decimals() view returns (uint8)'];

/**
 * Fetches all V2 positions using Alchemy's Token API.
 * Identifies LP tokens by checking if they are valid pairs in the V2 Factory.
 */
export async function getAllV2Positions(
  provider: JsonRpcProvider, // Must be an Alchemy Provider
  userAddress: string,
  getTokenById: (address: string) => Token | undefined,
): Promise<UniswapPosition[]> {
  const getTokenDecimals = (address: string) => {
    const token = getTokenById(address);
    if (token) return token.decimals;
    const contract = new Contract(address, ERC20_ABI, provider);
    return contract.decimals();
  };

  const positions: UniswapPosition[] = [];
  const factoryContract = new Contract(
    V2_FACTORY_ADDRESS,
    V2_FACTORY_ABI,
    provider,
  );

  // 1. Fetch All Token Balances via Alchemy
  // This custom RPC call returns all non-zero ERC20 balances for the user
  console.log('Fetching token balances from Alchemy...');
  const response = await provider.send('alchemy_getTokenBalances', [
    userAddress,
    'erc20',
  ]);

  const tokenBalances = response.tokenBalances;
  console.log(`Found ${tokenBalances.length} tokens. Checking for V2 Pairs...`);

  // 2. Filter & Verify Pairs
  // We iterate through every token the user owns
  for (const tokenData of tokenBalances) {
    const pairAddress = tokenData.contractAddress;
    const rawBalance = BigInt(tokenData.tokenBalance); // Hex string -> BigInt

    // Optimization: Skip if balance is effectively zero
    if (rawBalance === 0n) continue;

    try {
      const pairContract = new Contract(pairAddress, V2_PAIR_ABI, provider);

      // A. Check Symbol (Optimization)
      // Most V2 pairs have symbol 'UNI-V2'. We can skip obviously wrong tokens (like USDT).
      // However, to be 100% safe against forks, we try reading token0/token1.
      // If it doesn't have token0(), it reverts, and we catch/ignore it.
      const [token0, token1, symbol] = await Promise.all([
        pairContract.token0(),
        pairContract.token1(),
        pairContract.symbol().catch(() => 'UNKNOWN'),
      ]);

      if (symbol !== 'UNI-V2') {
        // Optional: You can strict check this if you ONLY want official Uniswap V2
        // But many forks use different symbols.
        // The real check is the factory verification below.
      }

      // B. Verify with Factory
      // Confirm this token address is a legitimate pair created by the Uniswap V2 Factory
      const officialPair = await factoryContract.getPair(token0, token1);

      if (officialPair.toLowerCase() !== pairAddress.toLowerCase()) {
        continue; // It mimics a pair but isn't registered -> Fake/Scam or different Dex
      }

      // C. Get Reserves & Total Supply
      const [reserves, totalSupply] = await Promise.all([
        pairContract.getReserves(),
        pairContract.totalSupply(),
      ]);

      // D. Calculate User's Share
      // underlyingAmount = (userBalance * reserve) / totalSupply
      const amount0 = (rawBalance * reserves.reserve0) / totalSupply;
      const amount1 = (rawBalance * reserves.reserve1) / totalSupply;

      const [dec0, dec1] = await Promise.all([
        getTokenDecimals(token0),
        getTokenDecimals(token1),
      ]);

      positions.push({
        id: pairAddress,
        dex: 'uniswap-v2',
        base: token0,
        quote: token1,
        min: '0',
        max: 'Infinity',
        baseLiquidity: formatUnits(amount0, dec0),
        quoteLiquidity: formatUnits(amount1, dec1),
        baseFee: '0',
        quoteFee: '0',
        fee: '3000', // Hardcoded 0.3%
      });
    } catch (error) {
      // If calls fail (e.g. token has no token0() method), it's not a pair.
      // Just ignore and move to next token.
    }
  }

  return positions;
}
