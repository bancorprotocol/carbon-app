import { useEffect, useMemo, useState } from 'react';
import { parseUnits, TransactionRequest } from 'ethers';
import { useWagmi } from 'libs/wagmi';
import { useTokens } from 'hooks/useTokens';
import { SafeDecimal } from 'libs/safedecimal';
import { useGetMultipleTokenPrices } from 'libs/queries/extApi/tokenPrice';
import { getUsdPrice, tokenAmount } from 'utils/helpers';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { carbonSDK } from 'libs/sdk';
import { calculateOverlappingPrices } from '@bancor/carbon-sdk/strategy-management';
import {
  getMaxSpread,
  isMaxBelowMarket,
  isMinAboveMarket,
} from 'components/strategies/overlapping/utils';
import { getFullRangesPrices } from 'components/strategies/common/utils';
import { Dexes, UniswapPosition } from 'components/uniswap/utils';
import { getUniswapPositions, withdrawPosition } from 'components/uniswap';
import { NotFound } from 'components/common/NotFound';
import config from 'config';

const dexNames: Record<Dexes, string> = {
  'uniswap-v2': 'Uniswap V2',
  'uniswap-v3': 'Uniswap V3',
};

type CreateStrategyParams = Parameters<typeof carbonSDK.createBuySellStrategy>;

export const MigratePage = () => {
  const { user, provider, signer, sendTransaction } = useWagmi();
  const [uniPositions, setUniPositions] = useState<UniswapPosition[]>([]);
  const { getTokenById } = useTokens();

  useEffect(() => {
    if (!user || !provider) return;
    getUniswapPositions(provider, user)
      // TODO: fetch missing tokens
      .then((positions) => setUniPositions(positions));
  }, [user, provider]);

  const tokens = useMemo(() => {
    if (!uniPositions.length) return;
    const list = new Set<string>();
    for (const position of uniPositions) {
      list.add(position.base);
      list.add(position.quote);
    }
    return Array.from(list);
  }, [uniPositions]);

  // TODO: this is broken because it uses the same query as UseTokenPrice but not the same result [address, price] vs price.
  // Create a dedicated cache
  const marketPriceQuery = useGetMultipleTokenPrices(tokens);

  const positions = useMemo(() => {
    if (marketPriceQuery.isPending) return;
    const marketPrices = marketPriceQuery.data || {};
    return uniPositions.map((pos) => {
      const basePrice = new SafeDecimal(marketPrices[pos.base]);
      const quotePrice = new SafeDecimal(marketPrices[pos.quote]);
      const baseFiat = basePrice.mul(pos.baseLiquidity);
      const baseFeeFiat = basePrice.mul(pos.baseFee);
      const quoteFiat = quotePrice.mul(pos.quoteLiquidity);
      const quoteFeeFiat = quotePrice.mul(pos.quoteFee);
      return {
        id: pos.id,
        dex: dexNames[pos.dex],
        base: getTokenById(pos.base)!,
        quote: getTokenById(pos.quote)!,
        liquidity: baseFiat.add(quoteFiat),
        feeLiquidity: baseFeeFiat.add(quoteFeeFiat),
        feePercent: `${new SafeDecimal(pos.fee).div(1_000).toString()}%`,
        min: pos.min.toString(),
        max: pos.max.toString(),
      };
    });
  }, [
    getTokenById,
    marketPriceQuery.data,
    marketPriceQuery.isPending,
    uniPositions,
  ]);

  const migrateOne = async (position: UniswapPosition) => {
    if (!signer) throw new Error('No Signer found');
    const marketPrices = marketPriceQuery.data || {};
    const transactions: TransactionRequest[] = [];

    const withdrawTxs = await withdrawPosition(signer, position);
    for (const tx of withdrawTxs) {
      transactions.push(tx);
    }

    // Create new strategies
    const base = getTokenById(position.base)!;
    const quote = getTokenById(position.quote)!;
    const basePrice = new SafeDecimal(marketPrices[position.base]);
    const quotePrice = new SafeDecimal(marketPrices[position.quote]);
    const marketPrice = basePrice.div(quotePrice).toString();
    const feePercent = new SafeDecimal(position.fee).div(1000);
    const maxSpread = getMaxSpread(Number(position.min), Number(position.max));
    const spread = Math.min(maxSpread, feePercent.toNumber()).toString();
    const isFullRange = position.min === '0' && position.max === 'Infinity';
    const fullrange = getFullRangesPrices(
      marketPrice,
      base.decimals,
      quote.decimals,
    );
    const min = isFullRange ? fullrange.min : position.min;
    const max = isFullRange ? fullrange.max : position.max;
    const prices = calculateOverlappingPrices(min, max, marketPrice, spread);
    const buyOrder = { min, marginalPrice: prices.buyPriceMarginal };
    const sellOrder = { max, marginalPrice: prices.sellPriceMarginal };
    const budgets = {
      sell: position.baseLiquidity,
      buy: position.quoteLiquidity,
    };
    if (isMinAboveMarket(buyOrder)) {
      budgets.buy = '0';
    } else if (isMaxBelowMarket(sellOrder)) {
      budgets.sell = '0';
    }
    const params: CreateStrategyParams = [
      position.base,
      position.quote,
      prices.buyPriceLow,
      prices.buyPriceMarginal,
      prices.buyPriceHigh,
      budgets.buy,
      prices.sellPriceLow,
      prices.sellPriceMarginal,
      prices.sellPriceHigh,
      budgets.sell,
    ];

    const unsignedTx = await carbonSDK.createBuySellStrategy(...params);
    unsignedTx.customData = {
      spender: config.addresses.carbon.carbonController,
      assets: [
        {
          address: position.base,
          rawAmount: parseUnits(budgets.sell, base.decimals).toString(),
        },
        {
          address: position.quote,
          rawAmount: parseUnits(budgets.buy, quote.decimals).toString(),
        },
      ],
    };
    transactions.push(unsignedTx);
    return transactions;
  };

  const migrate = async (index: number) => {
    const txs = await migrateOne(uniPositions[index]);
    const tx = await sendTransaction(txs);
    await tx.wait();
  };

  const migrateAll = async () => {
    if (!uniPositions?.length) return;
    const getAllTxs = uniPositions.map(migrateOne);
    const allTxs = await Promise.all(getAllTxs);
    const tx = await sendTransaction(allTxs.flat());
    await tx.wait();
  };

  if (!positions) {
    return <CarbonLogoLoading className="h-80" />;
  }

  if (!positions.length) {
    return (
      <NotFound
        className="grid-area-[list] surface rounded-2xl"
        title="No Position Found"
        text=""
        variant="info"
      />
    );
  }

  return (
    <table className="table grid-area-[list]">
      <thead>
        <tr>
          <th>Dex</th>
          <th>Pool</th>
          <th>Position</th>
          <th>Fees</th>
          <th>Pool fee tier</th>
          <th>Price range (Min)</th>
          <th>Price range (Max)</th>
          <th>
            <button className="btn-on-surface" onClick={migrateAll}>
              Migrate all
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {positions.map((position, i) => (
          <tr key={position.id}>
            <td>{position.dex}</td>
            <td>
              <TokensOverlap
                tokens={[position.base, position.quote]}
                size={32}
              />
            </td>
            <td>{getUsdPrice(position.liquidity)}</td>
            <td>{getUsdPrice(position.feeLiquidity)}</td>
            <td>{position.feePercent}</td>
            <td>{tokenAmount(position.min, position.quote)}</td>
            <td>{tokenAmount(position.max, position.quote)}</td>
            <td>
              <button className="btn-on-surface" onClick={() => migrate(i)}>
                Migrate
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
