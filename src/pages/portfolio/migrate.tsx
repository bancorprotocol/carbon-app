import {
  FC,
  FormEvent,
  FunctionComponent,
  SVGProps,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
import { useDialog } from 'hooks/useDialog';
import IconClose from 'assets/icons/X.svg?react';
import IconCarbon from 'assets/logos/carbon.svg?react';
import IconUniswap from 'assets/logos/uniswap.svg?react';
import config from 'config';
import { TokenLogo } from 'components/common/imager/Imager';
import { Token } from 'libs/tokens';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries';
import { useNotifications } from 'hooks/useNotifications';

const dexNames: Record<Dexes, string> = {
  'uniswap-v2': 'Uniswap V2',
  'uniswap-v3': 'Uniswap V3',
};
const dexIcon: Record<Dexes, FunctionComponent<SVGProps<SVGSVGElement>>> = {
  'uniswap-v2': (props) => <IconUniswap {...props} />,
  'uniswap-v3': (props) => <IconUniswap {...props} />,
};

interface MigratedPosition {
  id: string;
  dex: Dexes;
  base: Token;
  quote: Token;
  spread: string;
  buy: {
    min: string;
    marginalPrice: string;
    max: string;
    budget: string;
    fee: string;
  };
  sell: {
    min: string;
    marginalPrice: string;
    max: string;
    budget: string;
    fee: string;
  };
  fiat: {
    base: {
      budget: string;
      fee: string;
    };
    quote: {
      budget: string;
      fee: string;
    };
    total: {
      budget: string;
      fee: string;
    };
  };
}

type CreateStrategyParams = Parameters<typeof carbonSDK.createBuySellStrategy>;

export const MigratePage = () => {
  const { user, provider } = useWagmi();
  const [uniPositions, setUniPositions] = useState<UniswapPosition[]>();
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const { getTokenById } = useTokens();

  useEffect(() => {
    if (!user || !provider) return;
    getUniswapPositions(provider, user)
      // TODO: fetch missing tokens
      .then((positions) => setUniPositions(positions));
  }, [user, provider]);

  const tokens = useMemo(() => {
    if (!uniPositions?.length) return;
    const list = new Set<string>();
    for (const position of uniPositions) {
      list.add(position.base);
      list.add(position.quote);
    }
    return Array.from(list);
  }, [uniPositions]);

  // Create a dedicated cache
  const marketPriceQuery = useGetMultipleTokenPrices(tokens);

  const positions = useMemo((): undefined | MigratedPosition[] => {
    if (marketPriceQuery.isPending) return;
    if (!uniPositions) return;
    const marketPrices = marketPriceQuery.data || {};
    return uniPositions.map((pos) => {
      const basePrice = new SafeDecimal(marketPrices[pos.base]);
      const quotePrice = new SafeDecimal(marketPrices[pos.quote]);
      const baseBudgetFiat = basePrice.mul(pos.baseLiquidity);
      const baseFeeFiat = basePrice.mul(pos.baseFee);
      const quoteBudgetFiat = quotePrice.mul(pos.quoteLiquidity);
      const quoteFeeFiat = quotePrice.mul(pos.quoteFee);
      return {
        id: pos.id,
        dex: pos.dex,
        base: getTokenById(pos.base)!,
        quote: getTokenById(pos.quote)!,
        spread: new SafeDecimal(pos.fee).div(1_000).toString(),
        buy: {
          min: pos.min.toString(),
          marginalPrice: '',
          max: '',
          budget: pos.quoteLiquidity,
          fee: pos.quoteFee,
        },
        sell: {
          min: '',
          marginalPrice: '',
          max: pos.max.toString(),
          budget: pos.baseLiquidity,
          fee: pos.baseFee,
        },
        fiat: {
          base: {
            budget: baseBudgetFiat.toString(),
            fee: baseFeeFiat.toString(),
          },
          quote: {
            budget: quoteBudgetFiat.toString(),
            fee: quoteFeeFiat.toString(),
          },
          total: {
            budget: baseBudgetFiat.add(quoteBudgetFiat).toString(),
            fee: baseFeeFiat.add(quoteFeeFiat).toString(),
          },
        },
      };
    });
  }, [
    getTokenById,
    marketPriceQuery.data,
    marketPriceQuery.isPending,
    uniPositions,
  ]);

  const selectedPosition = useMemo(() => {
    if (typeof selectedIndex !== 'number') return;
    if (!positions) return;
    return positions[selectedIndex];
  }, [selectedIndex, positions]);

  if (!positions) {
    return <CarbonLogoLoading className="h-80 grid-area-[list]" />;
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
    <>
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
            <th></th>
          </tr>
        </thead>
        <tbody className="align-top">
          {positions.map((p, i) => {
            const dexName = dexNames[p.dex];
            const Icon = dexIcon[p.dex];
            return (
              <tr key={p.id}>
                <td>
                  <div className="inline-flex items-center gap-8">
                    <Icon className="size-24" />
                    {dexName}
                  </div>
                </td>
                <td>
                  <TokensOverlap tokens={[p.base, p.quote]} size={32} />
                </td>
                <td>
                  <div className="inline-grid gap-8">
                    {getUsdPrice(p.fiat.total.budget)}
                    <div className="inline-flex items-center gap-4">
                      <TokenLogo token={p.base} size={14} />
                      {tokenAmount(p.sell.budget, p.base)}
                    </div>
                    <div className="inline-flex items-center gap-4">
                      <TokenLogo token={p.quote} size={14} />
                      {tokenAmount(p.buy.budget, p.quote)}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="inline-grid gap-8">
                    {getUsdPrice(p.fiat.total.fee)}
                    <div className="inline-flex items-center gap-4">
                      <TokenLogo token={p.base} size={14} />
                      {tokenAmount(p.sell.fee, p.base)}
                    </div>
                    <div className="inline-flex items-center gap-4">
                      <TokenLogo token={p.quote} size={14} />
                      {tokenAmount(p.buy.fee, p.quote)}
                    </div>
                  </div>
                </td>
                <td>{p.spread}%</td>
                <td>
                  <div className="inline-grid gap-8">
                    <p>{tokenAmount(p.buy.min, p.quote)}</p>
                    <p className="text-12 text-white/60">
                      {p.quote.symbol} per {p.base.symbol}
                    </p>
                  </div>
                </td>
                <td>
                  <div className="inline-grid gap-8">
                    <p>{tokenAmount(p.sell.max, p.quote)}</p>
                    <p className="text-12 text-white/60">
                      {p.quote.symbol} per {p.base.symbol}
                    </p>
                  </div>
                </td>
                <td>
                  <button
                    className="btn-on-surface"
                    onClick={() => setSelectedIndex(i)}
                  >
                    Migrate
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {selectedPosition && <PositionDialog position={selectedPosition} />}
    </>
  );
};

const PositionDialog: FC<{ position: MigratedPosition }> = (props) => {
  const { ref, open, lightDismiss, close } = useDialog();
  const { user, signer, sendTransaction } = useWagmi();
  const p = props.position;

  // TODO: This should be done by the `useCreateStrategy` once the approval is centralized
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { dispatchNotification } = useNotifications();
  const cache = useQueryClient();

  const marketPriceQuery = useMarketPrice(p);

  useEffect(() => {
    open();
  }, [open]);

  const migrateOne = async (position: MigratedPosition) => {
    if (!signer) throw new Error('No Signer found');

    // Copy because we mutate it later
    const { base, quote, buy, sell } = structuredClone(position);

    const marketPrice = marketPriceQuery.marketPrice?.toString();
    if (!marketPrice) throw new Error('No market price available');
    const transactions: TransactionRequest[] = [];

    const withdrawTxs = await withdrawPosition(
      signer,
      position.dex,
      position.id,
    );
    for (const tx of withdrawTxs) {
      transactions.push(tx);
    }

    // Create new strategies

    const maxSpread = getMaxSpread(Number(buy.min), Number(sell.max));
    const spread = Math.min(maxSpread, Number(position.spread)).toString();
    const isFullRange = buy.min === '0' && sell.max === 'Infinity';
    const fullrange = getFullRangesPrices(
      marketPrice,
      base.decimals,
      quote.decimals,
    );
    const min = isFullRange ? fullrange.min : buy.min;
    const max = isFullRange ? fullrange.max : sell.max;
    const prices = calculateOverlappingPrices(min, max, marketPrice, spread);
    buy.marginalPrice = prices.buyPriceMarginal;
    buy.max = prices.buyPriceHigh;
    sell.min = prices.sellPriceLow;
    sell.marginalPrice = prices.sellPriceMarginal;
    if (isMinAboveMarket(buy)) {
      buy.budget = '0';
    } else if (isMaxBelowMarket(sell)) {
      sell.budget = '0';
    }
    const params: CreateStrategyParams = [
      base.address,
      quote.address,
      buy.min,
      buy.marginalPrice,
      buy.max,
      buy.budget,
      sell.min,
      sell.marginalPrice,
      sell.max,
      sell.budget,
    ];
    console.log(params);
    const unsignedTx = await carbonSDK.createBuySellStrategy(...params);
    unsignedTx.customData = {
      spender: config.addresses.carbon.carbonController,
      assets: [
        {
          address: base.address,
          rawAmount: parseUnits(sell.budget, base.decimals).toString(),
        },
        {
          address: quote.address,
          rawAmount: parseUnits(buy.budget, quote.decimals).toString(),
        },
      ],
    };
    transactions.push(unsignedTx);
    return transactions;
  };

  const migrate = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) throw new Error('No User connected for migration');
    try {
      setIsProcessing(true);
      const txs = await migrateOne(p);
      const tx = await sendTransaction(txs);
      await tx.wait();
      dispatchNotification('createStrategy', { txHash: tx.hash });
      cache.invalidateQueries({
        queryKey: QueryKey.strategiesByUser(user),
      });
      cache.invalidateQueries({
        queryKey: QueryKey.balance(user, p.base.address),
      });
      cache.invalidateQueries({
        queryKey: QueryKey.balance(user, p.quote.address),
      });
      close();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <dialog
      key={p.id}
      ref={ref}
      className="modal center"
      onClick={lightDismiss}
    >
      <form method="dialog" className="grid gap-16" onSubmit={migrate}>
        <header className="flex items-center justify-between">
          <h3>Migrate Position + Fees</h3>
          <button type="button" onClick={() => close()}>
            <IconClose className="size-14" />
          </button>
        </header>
        <div className="bg-main-900/60 rounded-2xl px-16 py-8 font-title">
          <table className="w-full border-separate border-spacing-y-8 text-12">
            <thead>
              <tr className="text-white/60">
                <th className="text-start font-normal">Position:</th>
                <th className="text-start font-normal">+Fees:</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-16 font-medium">
                <td>{getUsdPrice(p.fiat.total.budget)}</td>
                <td>{getUsdPrice(p.fiat.total.fee)}</td>
              </tr>
              <tr>
                <td>
                  <div className="inline-flex items-center gap-4">
                    <TokenLogo token={p.base} size={14} />
                    {tokenAmount(p.sell.budget, p.base)}
                  </div>
                </td>
                <td>
                  <div className="inline-flex items-center gap-4">
                    <TokenLogo token={p.base} size={14} />
                    {tokenAmount(p.sell.fee, p.base)}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="inline-flex items-center gap-4">
                    <TokenLogo token={p.base} size={14} />
                    {tokenAmount(p.buy.budget, p.quote)}
                  </div>
                </td>
                <td>
                  <div className="inline-flex items-center gap-4">
                    <TokenLogo token={p.base} size={14} />
                    {tokenAmount(p.buy.fee, p.quote)}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-center gap-16 bg-main-900/60 rounded-2xl px-16 py-8 font-title font-medium text-14">
          <div className="flex items-center gap-8 py-8">
            <IconUniswap className="size-24" />
            <p>{p.dex}</p>
          </div>
          <svg
            width="100"
            height="24"
            viewBox="0 0 100 24"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <line
              x1="5"
              x2="95"
              y1="12"
              y2="12"
              strokeDasharray="13"
              stroke="var(--color-primary)"
            />
            <path
              d="M85,4 L95,12 L85,20"
              strokeLinejoin="round"
              stroke="url(#svg-brand-gradient)"
            />
          </svg>
          <div className="flex items-center gap-8 py-8">
            <IconCarbon className="size-24" />
            <p>Carbon Defi</p>
          </div>
        </div>
        <div className="bg-main-900/60 rounded-2xl px-16 py-8 font-title">
          <table className="w-full border-separate caption-bottom border-spacing-y-8">
            <tbody className="text-12">
              <tr>
                <th className="text-start text-white/60 font-normal">
                  Min Price
                </th>
                <td>
                  {tokenAmount(p.buy.min, p.quote)} per {p.base.symbol}
                </td>
              </tr>
              <tr>
                <th className="text-start text-white/60 font-normal">
                  Max Price
                </th>
                <td>
                  {tokenAmount(p.sell.max, p.quote)} per {p.base.symbol}
                </td>
              </tr>
              <tr>
                <th className="text-start text-white/60 font-normal">
                  Fee Tier
                </th>
                <td>{p.spread}%</td>
              </tr>
            </tbody>
            <caption className="text-start text-10 text-white/40">
              *fetched from original position
            </caption>
          </table>
        </div>
        <p className="text-14 text-center">
          NOTE: Any unused funds will be sent back to your wallet
        </p>
        <button
          className="btn-primary-gradient"
          type="submit"
          disabled={isProcessing}
        >
          {isProcessing ? 'Loading' : 'Migrate'}
        </button>
      </form>
    </dialog>
  );
};
