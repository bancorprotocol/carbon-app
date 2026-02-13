import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { TokenLogo } from 'components/common/imager/Imager';
import { useModal } from 'hooks/useModal';
import { useTokens } from 'hooks/useTokens';
import { getLastVisitedPair } from 'libs/routing';
import AddIcon from 'assets/icons/plus.svg?react';
import RemoveIcon from 'assets/icons/X.svg?react';
import ChevronIcon from 'assets/icons/chevron.svg?react';
import {
  FC,
  FormEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';
import {
  LiquidityMatrixSearch,
  PairFormSearch,
} from 'libs/routing/routes/liquidity-matrix';
import { Token } from 'libs/tokens';
import { SafeDecimal } from 'libs/safedecimal';
import {
  calculateOverlappingBuyBudget,
  calculateOverlappingPrices,
  calculateOverlappingSellBudget,
} from '@bancor/carbon-sdk/strategy-management';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { getUsdPrice, prettifyNumber, tokenAmount } from 'utils/helpers';
import {
  useGetTokenPrice,
  useGetMultipleTokenPrices,
} from 'libs/queries/extApi/tokenPrice';
import { StaticOrder } from 'components/strategies/common/types';
import { useCreateStrategy } from 'components/strategies/create/useCreateStrategy';
import { getMaxSpread } from 'components/strategies/overlapping/utils';
import { useGetTokenBalance } from 'libs/queries';
import { useWagmi } from 'libs/wagmi';
import { lsService } from 'services/localeStorage';
import { isZero } from 'components/strategies/common/utils';
import './index.css';
import { getAddress, TransactionRequest } from 'ethers';
import { carbonSDK } from 'libs/sdk';
import config from 'config';
import { useBatchTransaction } from 'libs/wagmi/batch-transaction';

const batcher = config.addresses.carbon.batcher;

const animateLeaving = (address: string, options: { isLast: boolean }) => {
  const elements = document.querySelectorAll(`[data-on-leave="${address}"]`);
  const keyframes = [
    { transform: 'scale(1)', opacity: 1 },
    { transform: 'scale(0.9)', opacity: 0 },
  ];
  const animations = Array.from(elements).map((element) => {
    return element.animate(keyframes, {
      duration: 100,
      easing: 'ease-in',
      fill: 'forwards',
    });
  });
  if (options.isLast) {
    const summary = document.querySelector('.summary');
    summary?.animate(keyframes, { duration: 100, easing: 'ease-in' });
  }
  return Promise.all(animations.map((a) => a?.finished));
};

const flip = (selectors: string) => {
  const previous = document.querySelectorAll<HTMLElement>(selectors);
  const positions = new Map<HTMLElement, DOMRect>();
  for (const element of previous) {
    const rect = element.getBoundingClientRect();
    if (!rect.width) continue;
    positions.set(element, element.getBoundingClientRect());
  }
  let frames = 0;
  const retry = () => {
    const next = document.querySelectorAll<HTMLElement>(selectors);
    if (next.length === previous.length) {
      if (++frames > 10) return;
      else return requestAnimationFrame(retry);
    }
    for (const element of next) {
      if (positions.has(element)) {
        const previousRect = positions.get(element)!;
        const nextRect = element.getBoundingClientRect();
        if (previousRect.x !== nextRect.x || previousRect.y !== nextRect.y) {
          const x = previousRect.x - nextRect.x;
          const y = previousRect.y - nextRect.y;
          element.animate(
            [
              { transform: `translate(${x}px, ${y}px)` },
              { transform: `translate(0, 0)` },
            ],
            { duration: 300, easing: 'ease-in-out' },
          );
        }
      } else {
        element.animate(
          [
            { transform: 'scale(0.9)', opacity: 0 },
            { transform: 'scale(1)', opacity: 1 },
          ],
          { duration: 300, easing: 'ease-out' },
        );
      }
      positions.set(element, element.getBoundingClientRect());
    }
  };
  requestAnimationFrame(retry);
};

interface GetStrategiesParams {
  base: string;
  basePrice: string;
  spread: string;
  concentration: string;
  pairs: PairFormSearch[];
}

type LocalStrategy = ReturnType<typeof getStrategies>[number];
const getStrategies = (params: GetStrategiesParams) => {
  const { base, basePrice, spread, concentration, pairs } = params;
  const multiplicator = new SafeDecimal(concentration).div(100).add(1);
  return pairs.map((pair) => {
    const price = pair.price || '0';
    const baseBudget = pair.baseBudget || '0';
    const quoteBudget = pair.quoteBudget || '0';
    const marketPrice = new SafeDecimal(basePrice).div(price).toString();
    const min = new SafeDecimal(marketPrice).div(multiplicator).toString();
    const max = new SafeDecimal(marketPrice).mul(multiplicator).toString();
    const prices = calculateOverlappingPrices(min, max, marketPrice, spread);
    return {
      base,
      quote: pair.quote,
      buyMin: prices.buyPriceLow,
      buyMax: prices.buyPriceHigh,
      buyMarginal: prices.buyPriceMarginal,
      buyBudget: quoteBudget,
      buyBudgetUSD: new SafeDecimal(+quoteBudget).mul(+price).toString(),
      sellMin: prices.sellPriceLow,
      sellMax: prices.sellPriceHigh,
      sellMarginal: prices.sellPriceMarginal,
      sellBudget: baseBudget,
      sellBudgetUSD: new SafeDecimal(+baseBudget).mul(+basePrice).toString(),
    };
  });
};

const getRatios = (prices: string[]) => {
  const table: string[][] = [];
  for (let i = 0; i < prices.length; i++) {
    table.push([]);
    for (let j = 0; j < prices.length; j++) {
      if (!Number(prices[i]) || !Number(prices[j])) table[i][j] = '0';
      else table[i][j] = new SafeDecimal(prices[i]).div(prices[j]).toString();
    }
  }
  return table;
};

const createPair = (quote: string) => ({
  quote,
  price: '',
  baseBudget: '',
  quoteBudget: '',
});

const usdPrice = (value?: string | number) => {
  if (!value) return '';
  return getUsdPrice(value, { abbreviate: true });
};
const round = (value: number) => Math.round(value * 100) / 100;

const url = '/liquidity-matrix';
export const LiquidityMatrixPage = () => {
  const { user, sendTransaction } = useWagmi();
  const { getTokenById, importTokens } = useTokens();
  const { openModal } = useModal();
  const { canBatchTransactions } = useBatchTransaction();
  const search = useSearch({ from: url });
  const navigate = useNavigate({ from: url });
  const set = useCallback(
    (query: Partial<LiquidityMatrixSearch>) => {
      navigate({
        params: (params) => params,
        search: (previous) => ({ ...previous, ...query }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate],
  );

  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const { base, quote } = getLastVisitedPair();
    if (!getTokenById(search.base)) set({ base: getAddress(base) });
    if (!search.pairs) set({ pairs: [createPair(getAddress(quote))] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [set]);

  const base = getTokenById(search.base);
  const basePrice = search.basePrice ?? '0';
  const spread = search.spread || '0.01';
  const concentration = search.concentration ?? '5';
  const pairs = useMemo(() => search.pairs ?? [], [search.pairs]);
  const quotes = pairs.map((p) => getTokenById(p.quote)!);
  const ratios = getRatios([basePrice, ...pairs.map((p) => p.price ?? '1')]);

  const strategies = useMemo(() => {
    if (!search.base) return [];
    return getStrategies({
      base: search.base,
      basePrice,
      pairs,
      spread,
      concentration,
    });
  }, [search.base, basePrice, concentration, pairs, spread]);

  const maxSpread = useMemo(() => {
    const allMaxSpread = strategies.map((order) => {
      if (!+order.buyMin || !+order.sellMax) return 100;
      return getMaxSpread(+order.buyMin, +order.sellMax);
    });
    const min = round(Math.min(...allMaxSpread));
    return min.toString();
  }, [strategies]);

  // Set base market price
  const { data: baseTokenPrice } = useGetTokenPrice(search.base);
  useEffect(() => {
    if (Number(basePrice)) return;
    if (!baseTokenPrice) return;
    set({ basePrice: baseTokenPrice?.toString() ?? '' });
  }, [basePrice, baseTokenPrice, set]);

  // Set quotes market prices
  const quotePrices = useGetMultipleTokenPrices(pairs.map((p) => p.quote));
  useEffect(() => {
    let changes = false;
    const copy = structuredClone(pairs);
    const prices = quotePrices.data;
    for (let i = 0; i < prices.length; i++) {
      if (copy[i].price) continue;
      if (!prices[i]) continue;
      changes = true;
      copy[i].price = prices[i]!.toString() ?? '';
    }
    if (changes) set({ pairs: copy });
  }, [pairs, quotePrices, set]);

  if (!base) return;

  const selectBase = () => {
    openModal('tokenLists', {
      excludedTokens: [base.address, ...pairs.map((p) => p.quote)],
      onClick: async (token) => {
        importTokens([token]);
        const copy = structuredClone(pairs);
        for (const pair of copy) {
          pair.baseBudget = '';
          pair.quoteBudget = '';
        }
        set({ base: token.address, basePrice: '', pairs: copy });
      },
    });
  };

  const addPair = () => {
    openModal('tokenLists', {
      excludedTokens: [base.address, ...pairs.map((p) => p.quote)],
      onClick: (token) => {
        importTokens([token]);
        flip('article, h2, li, tr');
        set({ pairs: [...pairs, createPair(token.address)] });
      },
    });
  };
  const removeQuote = async (address: string) => {
    const quote = address.toLowerCase();
    await animateLeaving(address, { isLast: pairs.length === 1 });
    flip('article, h2, li, tr');
    set({ pairs: pairs.filter((v) => v.quote.toLowerCase() !== quote) });
  };
  const updatePair = (index: number, params: Partial<PairFormSearch>) => {
    const copy = structuredClone(pairs);
    copy[index] = { ...copy[index], ...params };
    set({ pairs: copy });
  };

  const createAll = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!batcher) return;
    const create = async () => {
      try {
        if (!user) throw new Error('No user found');
        const canBatch = await canBatchTransactions(user);
        const transactions: TransactionRequest[] = [];
        if (canBatch) {
          const getTransactions = strategies.map((strategy) => {
            return carbonSDK.createBuySellStrategy(
              strategy.base,
              strategy.quote,
              strategy.buyMin,
              strategy.buyMarginal || strategy.buyMax,
              strategy.buyMax,
              strategy.buyBudget,
              strategy.sellMin,
              strategy.sellMarginal || strategy.sellMax,
              strategy.sellMax,
              strategy.sellBudget,
            );
          });
          const allTxs = await Promise.all(getTransactions);
          allTxs.forEach((tx) => transactions.push(tx));
        } else {
          const params = strategies.map((strategy) => ({
            baseToken: strategy.base,
            quoteToken: strategy.quote,
            buyPriceLow: strategy.buyMin,
            buyPriceMarginal: strategy.buyMarginal || strategy.buyMax,
            buyPriceHigh: strategy.buyMax,
            buyBudget: strategy.buyBudget,
            sellPriceLow: strategy.sellMin,
            sellPriceMarginal: strategy.sellMarginal || strategy.sellMax,
            sellPriceHigh: strategy.sellMax,
            sellBudget: strategy.sellBudget,
          }));
          const unsignedTx =
            await carbonSDK.batchCreateBuySellStrategies(params);
          transactions.push(unsignedTx);
        }
        setDisabled(true);
        const tx = await sendTransaction(transactions);
        await tx.wait();
        await Promise.all(
          strategies.map((s) => animateLeaving(s.quote, { isLast: true })),
        );
        flip('article, h2, li, tr');
        set({ pairs: [] });
      } finally {
        setDisabled(false);
      }
    };
    create();
  };

  return (
    <section className="page px-32">
      <h1>Liquidity Matrix</h1>
      <form
        onSubmit={createAll}
        data-disabled={disabled}
        className="matrix-form"
      >
        <SaveLocally />
        <article role="group">
          <h2>Base token</h2>
          <div className="base">
            <button className="select" type="button" onClick={selectBase}>
              <TokenLogo token={base} size={32} />
              <span>{base.symbol}</span>
              <span className="description">Select your base token</span>
              <ChevronIcon className="size-16" />
            </button>
            <div className="price">
              <div className="price-field">
                <label htmlFor="base-price">
                  <TokenLogo token={base} size={14} />
                  {base.symbol} Price
                </label>
                <input
                  id="base-price"
                  type="number"
                  value={basePrice}
                  onInput={(e) => set({ basePrice: e.currentTarget.value })}
                  min="0"
                  step="any"
                />
                <span className="suffix">USD</span>
              </div>
              <div className="price-action">
                {baseTokenPrice && (
                  <button
                    type="button"
                    onClick={() =>
                      set({ basePrice: baseTokenPrice.toString() })
                    }
                  >
                    Use Market Price: {usdPrice(baseTokenPrice)}
                  </button>
                )}
              </div>
            </div>
          </div>
        </article>

        <article role="group">
          <h2>Price Configuration</h2>
          <div className="price-config">
            <div className="field">
              <label className="prefix" htmlFor="spread">
                Fee Tier
              </label>
              <input
                id="spread"
                value={spread}
                onInput={(e) => set({ spread: e.currentTarget.value })}
                type="number"
                step="any"
                min="0.0000001"
                max={maxSpread}
              />
              <span className="suffix">%</span>
            </div>
            <div className="field">
              <label className="prefix" htmlFor="concentration">
                Concentration
              </label>
              <input
                id="concentration"
                value={concentration}
                onInput={(e) => set({ concentration: e.currentTarget.value })}
                type="number"
                step="any"
              />
              <span className="suffix">%</span>
            </div>
          </div>
        </article>
        <article role="group">
          <h2>Add your quote tokens</h2>
          <ul className="pair-list">
            {pairs.map((pair, i) => (
              <PairForm
                key={pair.quote}
                base={base}
                basePrice={basePrice}
                quote={getTokenById(pair.quote)!}
                concentration={concentration}
                spread={spread}
                pair={pair}
                remove={removeQuote}
                update={(p) => updatePair(i, p)}
              />
            ))}
            <li className="pair" key="add">
              <button className="add-pair" type="button" onClick={addPair}>
                <AddIcon className="size-32" />
                Add quote
              </button>
            </li>
          </ul>
        </article>
        {!!quotes.length && (
          <article className="summary">
            <h2>Summary</h2>
            <div className="price-ratio">
              <h3>Token Price Ratio</h3>
              <table>
                <thead>
                  <tr>
                    <th></th>
                    {[base, ...quotes].map((token) => (
                      <th key={token.address}>{token.symbol}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[base, ...quotes].map((token, i) => (
                    <tr key={token.address}>
                      <th>per {token.symbol}</th>
                      {[base, ...quotes].map((otherToken, j) => (
                        <td key={otherToken.address}>
                          {prettifyNumber(ratios[i][j])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="strategies">
              <h3>Strategies</h3>
              <table>
                <thead>
                  <tr>
                    <th>Pair</th>
                    <th>Spread</th>
                    <th>Min Price</th>
                    <th>Max Price</th>
                    <th>Base Token Budget</th>
                    <th>Quote Token Budget</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {strategies.map((order) => (
                    <StrategyRow
                      key={order.quote}
                      strategy={order}
                      spread={spread}
                      base={base}
                      clear={() => removeQuote(order.quote)}
                    />
                  ))}
                </tbody>
              </table>
              <ul>
                {strategies.map((order) => (
                  <StrategyItem
                    key={order.quote}
                    strategy={order}
                    spread={spread}
                    base={base}
                    clear={() => removeQuote(order.quote)}
                  />
                ))}
              </ul>
            </div>
            {batcher && user && strategies.length > 1 && (
              <footer className="flex flex-col justify-end md:flex-row">
                <button type="submit">Create All</button>
              </footer>
            )}
          </article>
        )}
      </form>
    </section>
  );
};

interface PairFormProps {
  base: Token;
  basePrice: string;
  quote: Token;
  pair: PairFormSearch;
  concentration: string;
  spread: string;
  remove: (address: string) => void;
  update: (params: Partial<PairFormSearch>) => void;
}
const PairForm: FC<PairFormProps> = (props) => {
  const { base, quote, pair, spread, concentration, remove, update } = props;
  const id = useId();
  const { data: quotePrice } = useGetTokenPrice(quote.address);
  const { data: baseBalance } = useGetTokenBalance(base);
  const { data: quoteBalance } = useGetTokenBalance(quote);
  const basePrice = props.basePrice || '0';
  const baseBudget = pair.baseBudget || '0';
  const price = pair.price || '0';
  const quoteBudget = pair.quoteBudget || '0';

  const [localBaseBudgetUSD, setLocalBaseBudgetUSD] = useState('');
  const [localQuoteBudgetUSD, setLocalQuoteBudgetUSD] = useState('');

  useEffect(() => {
    const value = new SafeDecimal(baseBudget).mul(basePrice).toString();
    setLocalBaseBudgetUSD(value);
  }, [baseBudget, basePrice]);

  useEffect(() => {
    const price = quotePrice ?? '0';
    const value = new SafeDecimal(quoteBudget).mul(price).toString();
    setLocalQuoteBudgetUSD(value);
  }, [quoteBudget, quotePrice]);

  const setBaseBudget = (sellBudget: string) => {
    const multiplicator = new SafeDecimal(concentration).div(100).add(1);
    const marketPrice = new SafeDecimal(basePrice).div(price).toString();
    const min = new SafeDecimal(marketPrice).div(multiplicator).toString();
    const max = new SafeDecimal(marketPrice).mul(multiplicator).toString();
    const buyBudget = calculateOverlappingBuyBudget(
      base.decimals,
      quote.decimals,
      min,
      max,
      marketPrice,
      spread,
      sellBudget || '0',
    );
    update({
      baseBudget: sellBudget,
      quoteBudget: buyBudget,
    });
  };
  const setQuoteBudget = (buyBudget: string) => {
    const multiplicator = new SafeDecimal(concentration).div(100).add(1);
    const marketPrice = new SafeDecimal(basePrice).div(price).toString();
    const min = new SafeDecimal(marketPrice).div(multiplicator).toString();
    const max = new SafeDecimal(marketPrice).mul(multiplicator).toString();
    const sellBudget = calculateOverlappingSellBudget(
      base.decimals,
      quote.decimals,
      min,
      max,
      marketPrice,
      spread,
      buyBudget || '0',
    );
    update({
      baseBudget: sellBudget,
      quoteBudget: buyBudget,
    });
  };

  const setBaseBudgetFromUSD = (e: FormEvent<HTMLInputElement>) => {
    const budget = new SafeDecimal(e.currentTarget.value || '0').div(basePrice);
    setBaseBudget(budget.toString());
  };
  const setQuoteBudgetFromUSD = (e: FormEvent<HTMLInputElement>) => {
    const budget = new SafeDecimal(e.currentTarget.value || '0').div(price);
    setQuoteBudget(budget.toString());
  };

  return (
    <li className="pair" key={quote.address} data-on-leave={quote.address}>
      <header>
        <div className="quote-header">
          <TokenLogo token={quote} size={24} />
          <h3>{quote.symbol}</h3>
          <button type="button" onClick={() => remove(quote.address)}>
            <RemoveIcon className="size-16" />
          </button>
        </div>
        <div className="price">
          <div className="price-field">
            <label htmlFor={`${id}-price`}>
              <TokenLogo token={quote} size={14} />
              {quote.symbol} Price
            </label>
            <input
              id={`${id}-price`}
              type="number"
              value={price}
              onInput={(e) => update({ price: e.currentTarget.value })}
              min="0"
              step="any"
            />
            <span>USD</span>
          </div>
          <div className="price-action">
            {!!quotePrice && (
              <button
                type="button"
                onClick={() => update({ price: quotePrice.toString() })}
              >
                Use Market Price: {usdPrice(quotePrice)}
              </button>
            )}
          </div>
        </div>
      </header>
      <div className="budget-list">
        <h3>
          <TokensOverlap tokens={[base, quote]} size={24} />
          Budgets
        </h3>
        <div className="budget">
          <div className="token">
            <input
              id={`${id}-base-budget`}
              type="number"
              value={pair.baseBudget}
              onInput={(e) => setBaseBudget(e.currentTarget.value)}
              min="0"
              max={baseBalance}
              step="any"
            />
            <label htmlFor={`${id}-base-budget`}>
              <TokenLogo token={base} size={24} />
              <span>{base.symbol}</span>
            </label>
          </div>
          <div className="usd">
            <span>$</span>
            <input
              id={`${id}-base-usd`}
              type="number"
              value={localBaseBudgetUSD}
              onInput={(e) => setLocalBaseBudgetUSD(e.currentTarget.value)}
              onBlur={setBaseBudgetFromUSD}
              aria-label="budget in USD"
              min="0"
              step="any"
            />
          </div>
          {baseBalance && (
            <div className="balance">
              <button type="button" onClick={() => setBaseBudget(baseBalance)}>
                Use balance: <span>{tokenAmount(baseBalance, base)}</span>
              </button>
            </div>
          )}
          <output className="budget-error">Insufficient funds</output>
        </div>
        <div className="budget">
          <div className="token">
            <input
              id={`${id}-base-budget`}
              type="number"
              value={pair.quoteBudget}
              onInput={(e) => setQuoteBudget(e.currentTarget.value)}
              min="0"
              max={quoteBalance}
              step="any"
            />
            <label htmlFor={`${id}-quote-budget`}>
              <TokenLogo token={quote} size={24} />
              <span>{quote.symbol}</span>
            </label>
          </div>
          <div className="usd">
            <span>$</span>
            <input
              id={`${id}-quote-usd`}
              type="number"
              value={localQuoteBudgetUSD}
              onInput={(e) => setLocalQuoteBudgetUSD(e.currentTarget.value)}
              onBlur={setQuoteBudgetFromUSD}
              aria-label="budget in USD"
              min="0"
              step="any"
            />
          </div>
          {quoteBalance && (
            <div className="balance">
              <button
                type="button"
                onClick={() => setQuoteBudget(quoteBalance)}
              >
                Use balance: <span>{tokenAmount(quoteBalance, quote)}</span>
              </button>
            </div>
          )}
          <output className="budget-error">Insufficient funds</output>
        </div>
      </div>
    </li>
  );
};

export const SaveLocally = () => {
  const { getTokenById } = useTokens();
  const search = useSearch({ from: url });
  const [savedMatrix, setSavedMatrix] = useState(
    lsService.getItem('liquidityMatrix') ?? {},
  );
  const currentBase = useMemo(() => {
    if (!search.base) return;
    return getTokenById(search.base);
  }, [getTokenById, search.base]);

  const set = (result: Record<string, LiquidityMatrixSearch>) => {
    flip('.saved-matrix, .add-save');
    setSavedMatrix(result);
    lsService.setItem('liquidityMatrix', result);
  };
  const add = useCallback(() => {
    const base = search.base!;
    const copy = structuredClone(savedMatrix);
    copy[base] = search;
    set(copy);
  }, [savedMatrix, search]);

  const remove = async (base: string) => {
    await animateLeaving(base, { isLast: false });
    const copy = structuredClone(savedMatrix);
    delete copy[base];
    set(copy);
  };

  useEffect(() => {
    if (!Object.keys(savedMatrix).includes(search.base || '')) return;
    const timeout = setTimeout(add, 500);
    return () => clearTimeout(timeout);
  }, [add, search, savedMatrix]);

  return (
    <article className="save-locally">
      <ul role="listbox">
        {Object.values(savedMatrix).map((matrix) => {
          const base = getTokenById(matrix.base)!;
          const quotes = matrix.pairs?.map(({ quote }) => getTokenById(quote)!);
          return (
            <li
              key={base.address}
              role="option"
              className="saved-matrix"
              data-on-leave={base.address}
              aria-selected={base.address === search.base}
            >
              <Link
                className="select-base"
                to="."
                search={savedMatrix[base.address]}
                onClick={() => flip('article, h2, li, tr')}
              >
                <TokenLogo className="main-icon" token={base} size={32} />
                <TokensOverlap tokens={quotes ?? []} size={24} />
                <span className="description">{base.symbol}</span>
              </Link>
              <button
                className="remove"
                type="button"
                onClick={() => remove(base.address)}
              >
                <RemoveIcon className="size-16" />
              </button>
            </li>
          );
        })}
        <li role="none" className="add-save">
          <button type="button" disabled={!search.base} onClick={add}>
            {currentBase && (
              <div className="flex gap-8">
                <TokenLogo token={currentBase} size={24} />
                {currentBase.symbol}
              </div>
            )}
            <span className="description">Save it for later</span>
            <AddIcon className="main-icon size-24" />
          </button>
        </li>
      </ul>
    </article>
  );
};

interface StrategyProps {
  base: Token;
  spread: string;
  strategy: LocalStrategy;
  clear: () => void;
}
const StrategyRow: FC<StrategyProps> = ({ base, spread, strategy, clear }) => {
  const { getTokenById } = useTokens();
  const quote = getTokenById(strategy.quote)!;
  const { data: baseBalance } = useGetTokenBalance(base);
  const { data: quoteBalance } = useGetTokenBalance(quote);
  const { user } = useWagmi();

  const buy: StaticOrder = {
    min: strategy.buyMin,
    max: strategy.buyMax,
    marginalPrice: strategy.buyMarginal,
    budget: strategy.buyBudget,
  };
  const sell: StaticOrder = {
    min: strategy.sellMin,
    max: strategy.sellMax,
    marginalPrice: strategy.sellMarginal,
    budget: strategy.sellBudget,
  };

  const { createStrategy, isAwaiting, isProcessing } = useCreateStrategy({
    base,
    quote,
    buy,
    sell,
  });
  const disabled = (() => {
    if (!user) return true;
    if (new SafeDecimal(baseBalance || '0').lt(sell.budget)) return true;
    if (new SafeDecimal(quoteBalance || '0').lt(buy.budget)) return true;
    if ('Infinity' === strategy.buyMin) return true;
    if ('Infinity' === strategy.sellMax) return true;
    if (isZero(strategy.buyMin)) return true;
    if (isZero(strategy.sellMax)) return true;
    return isAwaiting || isProcessing;
  })();
  const createText = (() => {
    if (!user) return 'Connect Wallet';
    if (isAwaiting) return 'Waiting...';
    if (isProcessing) return 'Processing';
    return 'Create';
  })();

  const create = async () => {
    await createStrategy();
    clear();
  };

  return (
    <tr data-on-leave={quote.address}>
      <td>
        <TokensOverlap tokens={[base, quote]} size={24} />
      </td>
      <td>{spread}</td>
      <td>{tokenAmount(strategy.buyMin, quote)}</td>
      <td>{tokenAmount(strategy.sellMax, quote)}</td>
      <td>
        {tokenAmount(strategy.sellBudget, base)}&nbsp;
        <span className="usd">({usdPrice(strategy.sellBudgetUSD)})</span>
      </td>
      <td>
        {tokenAmount(strategy.buyBudget, quote)}&nbsp;
        <span className="usd">({usdPrice(strategy.buyBudgetUSD)})</span>
      </td>
      <td>
        <button type="button" disabled={disabled} onClick={create}>
          {createText}
        </button>
      </td>
    </tr>
  );
};

const StrategyItem: FC<StrategyProps> = ({ base, spread, strategy, clear }) => {
  const { getTokenById } = useTokens();
  const quote = getTokenById(strategy.quote)!;
  const { data: baseBalance } = useGetTokenBalance(base);
  const { data: quoteBalance } = useGetTokenBalance(quote);
  const { user } = useWagmi();

  const buy: StaticOrder = {
    min: strategy.buyMin,
    max: strategy.buyMax,
    marginalPrice: strategy.buyMarginal,
    budget: strategy.buyBudget,
  };
  const sell: StaticOrder = {
    min: strategy.sellMin,
    max: strategy.sellMax,
    marginalPrice: strategy.sellMarginal,
    budget: strategy.sellBudget,
  };

  const { createStrategy, isAwaiting, isProcessing } = useCreateStrategy({
    base,
    quote,
    buy,
    sell,
  });
  const disabled = (() => {
    if (!user) return true;
    if (new SafeDecimal(baseBalance || '0').lt(sell.budget)) return true;
    if (new SafeDecimal(quoteBalance || '0').lt(buy.budget)) return true;
    if ('Infinity' === strategy.buyMin) return true;
    if ('Infinity' === strategy.sellMax) return true;
    if (isZero(strategy.buyMin)) return true;
    if (isZero(strategy.sellMax)) return true;
    return isAwaiting || isProcessing;
  })();
  const createText = (() => {
    if (!user) return 'Connect Wallet';
    if (isAwaiting) return 'Waiting...';
    if (isProcessing) return 'Processing';
    return 'Create';
  })();
  const create = async () => {
    await createStrategy();
    clear();
  };

  return (
    <li className="strategy-card" data-on-leave={quote.address}>
      <p>
        <TokensOverlap tokens={[base, quote]} size={24} />
        <span>
          {base.symbol} / {quote.symbol}
        </span>
      </p>
      <p>
        <b>Spead</b>
        <span>{spread}</span>
      </p>
      <p>
        <b>Min Price</b>
        <span>{tokenAmount(strategy.buyMin, quote)}</span>
      </p>
      <p>
        <b>Max Price</b>
        <span>{tokenAmount(strategy.sellMax, quote)}</span>
      </p>
      <p>
        <b>Base Budget</b>
        <span>{tokenAmount(strategy.sellBudget, base)}</span>
        <span className="usd">({usdPrice(strategy.sellBudgetUSD)})</span>
      </p>
      <p>
        <b>Quote Budget</b>
        <span>{tokenAmount(strategy.buyBudget, quote)}</span>
        <span className="usd">({usdPrice(strategy.buyBudgetUSD)})</span>
      </p>
      <button type="button" disabled={disabled} onClick={create}>
        {createText}
      </button>
    </li>
  );
};
