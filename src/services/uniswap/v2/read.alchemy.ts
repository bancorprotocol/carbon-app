import { Contract, formatUnits, Provider } from 'ethers';
import { DexesV2, UniswapPosition, UniswapV2Config } from '../utils';
import { Token } from 'libs/tokens';

// --- Configuration ---

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

export interface TokenBalance {
  tokenBalance: string;
  contractAddress: string;
}

const getSessionTokenPairs = (dex: DexesV2) => {
  const pairs = sessionStorage.getItem(`${dex}-token-pairs`);
  if (!pairs) return {};
  return JSON.parse(pairs);
};
const tokenPairs: Record<DexesV2, Record<string, string[]>> = {
  'pancake-v2': getSessionTokenPairs('pancake-v2'),
  'uniswap-v2': getSessionTokenPairs('uniswap-v2'),
  'sushi-v2': getSessionTokenPairs('sushi-v2'),
};

/**
 * Fetches all V2 positions using Alchemy's Token API.
 * Identifies LP tokens by checking if they are valid pairs in the V2 Factory.
 */
export async function getAllV2PositionsFromBalances(
  config: UniswapV2Config,
  provider: Provider,
  balances: TokenBalance[],
  getTokenById: (address: string) => Token | undefined,
): Promise<UniswapPosition[]> {
  const getPairTokens = async (pairContract: Contract) => {
    const address = await pairContract.getAddress();
    if (!tokenPairs[config.dex][address]) {
      try {
        const [token0, token1] = await Promise.all([
          pairContract.token0(),
          pairContract.token1(),
        ]);
        tokenPairs[config.dex][address] = [token0, token1];
      } catch {
        tokenPairs[config.dex][address] = [];
      }
    }
    return tokenPairs[config.dex][address];
  };

  const getTokenDecimals = (address: string) => {
    const token = getTokenById(address);
    if (token) return token.decimals;
    const contract = new Contract(address, ERC20_ABI, provider);
    return contract.decimals();
  };

  // Get known ERC20 to remove them from the balances
  const erc20Import = await import('./erc20.json');
  const knownERC20 = new Set(erc20Import.default);

  const positions: UniswapPosition[] = [];
  const factoryContract = new Contract(
    config.factoryAddress,
    V2_FACTORY_ABI,
    provider,
  );

  for (const tokenData of balances) {
    const pairAddress = tokenData.contractAddress;
    if (knownERC20.has(pairAddress)) continue;

    const rawBalance = BigInt(tokenData.tokenBalance); // Hex string -> BigInt

    // Optimization: Skip if balance is effectively zero
    if (rawBalance === 0n) continue;

    const pairContract = new Contract(pairAddress, V2_PAIR_ABI, provider);

    const tokens = await getPairTokens(pairContract);
    if (tokens.length !== 2) continue;
    const [token0, token1] = tokens;

    const officialPair = await factoryContract.getPair(token0, token1);
    if (officialPair.toLowerCase() !== pairAddress.toLowerCase()) {
      tokenPairs[config.dex][pairAddress] = [];
      continue; // It mimics a pair but isn't registered -> Fake/Scam or different Dex
    }

    const [reserves, totalSupply] = await Promise.all([
      pairContract.getReserves(),
      pairContract.totalSupply(),
    ]);

    const amount0 = (rawBalance * reserves.reserve0) / totalSupply;
    const amount1 = (rawBalance * reserves.reserve1) / totalSupply;

    const [dec0, dec1] = await Promise.all([
      getTokenDecimals(token0),
      getTokenDecimals(token1),
    ]);

    positions.push({
      id: pairAddress,
      dex: config.dex,
      base: token0,
      quote: token1,
      min: '0',
      max: 'Infinity',
      baseLiquidity: formatUnits(amount0, dec0),
      quoteLiquidity: formatUnits(amount1, dec1),
      baseFee: '0',
      quoteFee: '0',
      fee: config.fee,
    });
  }

  return positions;
}
