import { Signer, Provider, Contract, formatUnits } from 'ethers';
import { Pool, Position, tickToPrice } from '@uniswap/v3-sdk';
import { Token, ChainId } from '@uniswap/sdk-core';
import JSBI from 'jsbi';

// --- Interfaces ---
export type Dexes = 'uniswap-v2' | 'uniswap-v3';

export interface UniswapPosition {
  id: string;
  dex: Dexes;
  base: string; // Token0
  quote: string; // Token1
  min: string; // Price: Token1 per Token0 (Lower Bound)
  max: string; // Price: Token1 per Token0 (Upper Bound)
  baseLiquidity: string;
  quoteLiquidity: string;
  baseFee: string;
  quoteFee: string;
  fee: string;
}

// --- Configuration ---
const POSITION_MANAGER_ADDRESS = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88';
const FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';

const MANAGER_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function positions(uint256 tokenId) view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)',
  'function collect((uint256 tokenId, address recipient, uint128 amount0Max, uint128 amount1Max)) external payable returns (uint256 amount0, uint256 amount1)',
];

const FACTORY_ABI = [
  'function getPool(address tokenA, address tokenB, uint24 fee) view returns (address pool)',
];
const POOL_ABI = [
  'function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
];
const ERC20_ABI = ['function decimals() view returns (uint8)'];

export async function getAllV3Positions(
  signerOrProvider: Signer | Provider,
  userAddress: string,
): Promise<UniswapPosition[]> {
  const provider =
    (signerOrProvider as Signer).provider || (signerOrProvider as Provider);
  const manager = new Contract(
    POSITION_MANAGER_ADDRESS,
    MANAGER_ABI,
    signerOrProvider,
  );
  const factory = new Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);

  const positions: UniswapPosition[] = [];
  const balance = await manager.balanceOf(userAddress);

  console.log(`Processing ${balance} V3 positions...`);

  for (let i = 0; i < Number(balance); i++) {
    try {
      // 1. Fetch Position Data
      const tokenId = await manager.tokenOfOwnerByIndex(userAddress, i);
      const posData = await manager.positions(tokenId);

      if (
        posData.liquidity === 0n &&
        posData.tokensOwed0 === 0n &&
        posData.tokensOwed1 === 0n
      )
        continue;

      // 2. Fetch Decimals (Crucial for Price Calculation)
      // Note: In production, cache these results to avoid repeated RPC calls for the same token
      const t0Contract = new Contract(posData.token0, ERC20_ABI, provider);
      const t1Contract = new Contract(posData.token1, ERC20_ABI, provider);
      const [dec0, dec1] = await Promise.all([
        t0Contract.decimals(),
        t1Contract.decimals(),
      ]);

      // 3. Create SDK Token Instances
      const token0 = new Token(ChainId.MAINNET, posData.token0, Number(dec0));
      const token1 = new Token(ChainId.MAINNET, posData.token1, Number(dec1));

      // 4. Fetch Pool State
      const poolAddress = await factory.getPool(
        posData.token0,
        posData.token1,
        posData.fee,
      );
      const poolContract = new Contract(poolAddress, POOL_ABI, provider);
      const slot0 = await poolContract.slot0();

      // 5. Calculate Prices (Min & Max)
      // tickToPrice returns Price object of Token0 in terms of Token1
      const priceLower = tickToPrice(token0, token1, Number(posData.tickLower));
      const priceUpper = tickToPrice(token0, token1, Number(posData.tickUpper));

      // 6. Calculate Amounts (Principal)
      const { amount0, amount1 } = calculateAmounts(
        posData.liquidity,
        slot0.sqrtPriceX96,
        Number(slot0.tick),
        Number(posData.tickLower),
        Number(posData.tickUpper),
        Number(posData.fee),
        token0,
        token1,
      );

      // 7. Get Fees
      const { fee0, fee1 } = await getPendingFees(
        manager,
        tokenId,
        userAddress,
      );

      const position: UniswapPosition = {
        id: tokenId.toString(),
        dex: 'uniswap-v3',
        base: posData.token0,
        quote: posData.token1,
        // Convert Price Object to String (using 15 significant digits for precision)
        min: priceLower.toSignificant(15),
        max: priceUpper.toSignificant(15),
        baseLiquidity: formatUnits(amount0, dec0),
        quoteLiquidity: formatUnits(amount1, dec1),
        baseFee: fee0,
        quoteFee: fee1,
        fee: posData.fee.toString(),
      };
      positions.push(position);
    } catch (error) {
      console.error(`Error processing token ${i}:`, error);
    }
  }

  return positions;
}

// --- UPDATED HELPER ---
function calculateAmounts(
  liquidity: bigint,
  sqrtPriceX96: bigint,
  tickCurrent: number,
  tickLower: number,
  tickUpper: number,
  fee: number,
  token0: Token, // Pass full Token object now
  token1: Token,
) {
  if (liquidity === 0n) return { amount0: '0', amount1: '0' };

  const pool = new Pool(
    token0,
    token1,
    fee,
    JSBI.BigInt(sqrtPriceX96.toString()),
    0,
    tickCurrent,
  );

  const position = new Position({
    pool,
    liquidity: JSBI.BigInt(liquidity.toString()),
    tickLower,
    tickUpper,
  });

  return {
    amount0: position.amount0.quotient.toString(),
    amount1: position.amount1.quotient.toString(),
  };
}

async function getPendingFees(
  manager: Contract,
  tokenId: bigint,
  owner: string,
) {
  const MAX_UINT128 = 340282366920938463463374607431768211455n;
  try {
    const result = await manager.collect.staticCall({
      tokenId: tokenId,
      recipient: owner,
      amount0Max: MAX_UINT128,
      amount1Max: MAX_UINT128,
    });
    return { fee0: result.amount0.toString(), fee1: result.amount1.toString() };
  } catch (e) {
    return { fee0: '0', fee1: '0' };
  }
}
