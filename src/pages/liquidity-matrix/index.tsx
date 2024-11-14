import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { TokenLogo } from 'components/common/imager/Imager';
import { useModal } from 'hooks/useModal';
import { useTokens } from 'hooks/useTokens';
import { getLastVisitedPair } from 'libs/routing';
import { hasFlag } from 'utils/featureFlags';
import { ReactComponent as AddIcon } from 'assets/icons/plus.svg';
import { ReactComponent as RemoveIcon } from 'assets/icons/X.svg';
import { ReactComponent as ChevronIcon } from 'assets/icons/chevron.svg';
import { FC, FormEvent, useCallback, useEffect, useId, useMemo } from 'react';
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
import { prettifyNumber, tokenAmount } from 'utils/helpers';
import {
  useGetMultipleTokenPrices,
  useGetTokenPrice,
} from 'libs/queries/extApi/tokenPrice';
import { BaseOrder } from 'components/strategies/common/types';
import { useCreateStrategy } from 'components/strategies/create/useCreateStrategy';
import './index.css';
import { getMaxSpread } from 'components/strategies/overlapping/utils';

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
      if (prices[j] === '0') table[i][j] = '0';
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

const usdPrice = (value: string) => {
  return prettifyNumber(value, { abbreviate: true, currentCurrency: 'USD' });
};

const getMin = (...data: string[]) => SafeDecimal.min(...data).toString();
const getMax = (...data: string[]) => SafeDecimal.max(...data).toString();
const round = (value: number) => Math.round(value * 100) / 100;
const clamp = (min: string, value: string, max: string) => {
  return getMin(max, getMax(value, min));
};

const url = '/liquidity-matrix';
export const LiquidityMatrixPage = () => {
  const { getTokenById } = useTokens();
  const { openModal } = useModal();
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
    [navigate]
  );

  useEffect(() => {
    const { base, quote } = getLastVisitedPair();
    if (!search.base) set({ base });
    if (!search.pairs) set({ pairs: [createPair(quote)] });
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
      return getMaxSpread(+order.buyMin, +order.sellMax);
    });
    const min = round(Math.min(...allMaxSpread));
    return min.toString();
  }, [strategies]);

  // Set base market price
  const { data: baseTokenPrice } = useGetTokenPrice(base?.address);
  useEffect(() => {
    if (!!Number(basePrice)) return;
    set({ basePrice: baseTokenPrice?.USD.toString() ?? '0' });
  }, [basePrice, baseTokenPrice, set]);

  // Set quotes market prices
  const quotePrices = useGetMultipleTokenPrices(pairs.map((p) => p.quote));
  useEffect(() => {
    let changes = false;
    const copy = structuredClone(pairs);
    for (let i = 0; i < quotePrices.length; i++) {
      if (!!Number(copy[i].price)) continue;
      changes = true;
      copy[i].price = quotePrices[i].data?.USD.toString() ?? '0';
    }
    if (changes) set({ pairs: copy });
  }, [pairs, quotePrices, set]);

  // TODO: Batch creation
  // const approvalTokens = useMemo(() => {
  //   if (!base) return [];
  //   const tokens: Record<string, ApprovalToken> = {};
  //   tokens[base.address] = { ...base, spender, amount: '0' };
  //   for (const order of orders) {
  //     const { address, decimals, symbol } = getTokenById(order.quote)!;
  //     const amount = order.buyBudget;
  //     tokens[order.quote] = { address, decimals, symbol, spender, amount };
  //     tokens[base.address].amount = new SafeDecimal(order.sellBudget)
  //       .add(tokens[base.address].amount)
  //       .toString();
  //   }
  //   return Object.values(tokens);
  // }, [base, orders, getTokenById]);
  // const approval = useApproval(approvalTokens);

  if (!hasFlag('liquidity-matrix')) {
    return (
      <section className="bg-background-900 place-center max-w-400px m-auto grid gap-16 rounded p-16">
        <h1>Page Under Feature Flag</h1>
        <p>
          To access this page you need to enable the "Liquidity Matrix" feature
          flag.
        </p>
        <Link to="/debug" className={buttonStyles({ variant: 'white' })}>
          Activate from here
        </Link>
      </section>
    );
  }

  if (!base) return;

  const selectBase = () => {
    openModal('tokenLists', {
      excludedTokens: [base.address, ...pairs.map((p) => p.quote)],
      onClick: (token) => {
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
      onClick: (t) => {
        set({ pairs: [...pairs, createPair(t.address)] });
      },
    });
  };
  const removeQuote = (address: string) => {
    const quote = address.toLowerCase();
    set({ pairs: pairs.filter((v) => v.quote.toLowerCase() !== quote) });
  };
  const updatePair = (index: number, params: Partial<PairFormSearch>) => {
    const copy = structuredClone(pairs);
    copy[index] = { ...copy[index], ...params };
    set({ pairs: copy });
  };

  return (
    <section className="page">
      <h1>Liquidity Matrix</h1>
      <form>
        <article role="group">
          <h2>Base token</h2>
          <div className="base">
            <button type="button" onClick={selectBase}>
              <TokenLogo token={base} size={32} />
              <span>{base.symbol}</span>
              <span className="description">Select your base token</span>
              <ChevronIcon className="size-16" />
            </button>
            <div className="field">
              <label className="prefix">
                <TokenLogo token={base} size={14} />
                {base.symbol} Price
              </label>
              <input
                type="number"
                value={basePrice}
                onInput={(e) => set({ basePrice: e.currentTarget.value })}
              />
              <span className="suffix">USD</span>
            </div>
          </div>
        </article>

        <article role="group">
          <h2>Price Configuration</h2>
          <div className="base">
            <div className="field">
              <label className="prefix" htmlFor="spread">
                Fee Tier
              </label>
              <input
                id="spread"
                value={clamp('0.01', spread, maxSpread)}
                onInput={(e) => set({ spread: e.currentTarget.value })}
                type="number"
                step="0.01"
                min="0.01"
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
            <li key="add">
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
                      <th>{token.symbol}</th>
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
  const basePrice = props.basePrice || '0';
  const baseBudget = pair.baseBudget || '0';
  const price = pair.price || '0';
  const quoteBudget = pair.quoteBudget || '0';
  const baseBudgetUSD = new SafeDecimal(baseBudget).mul(basePrice).toString();
  const quoteBudgetUSD = new SafeDecimal(quoteBudget).mul(price).toString();

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
      sellBudget || '0'
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
      buyBudget || '0'
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
    <li key={quote.address}>
      <header>
        <div className="quote-header">
          <TokenLogo token={quote} size={24} />
          <h3>{quote.symbol}</h3>
          <button type="button" onClick={() => remove(quote.address)}>
            <RemoveIcon className="size-16" />
          </button>
        </div>
        <div className="field">
          <label className="prefix" htmlFor={`${id}-price`}>
            <TokenLogo token={quote} size={14} />
            {quote.symbol} Price
          </label>
          <input
            id={`${id}-price`}
            type="number"
            value={pair.price}
            onInput={(e) => update({ price: e.currentTarget.value })}
            min="0"
          />
          <span className="suffix">USD</span>
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
              value={baseBudgetUSD}
              onInput={setBaseBudgetFromUSD}
              aria-label="budget in USD"
              min="0"
            />
          </div>
        </div>
        <div className="budget">
          <div className="token">
            <input
              id={`${id}-base-budget`}
              type="number"
              value={pair.quoteBudget}
              onInput={(e) => setQuoteBudget(e.currentTarget.value)}
              min="0"
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
              value={quoteBudgetUSD}
              onInput={setQuoteBudgetFromUSD}
              aria-label="budget in USD"
              min="0"
            />
          </div>
        </div>
      </div>
    </li>
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
  const order0: BaseOrder = {
    min: strategy.buyMin,
    max: strategy.buyMax,
    marginalPrice: strategy.buyMarginal,
    budget: strategy.buyBudget,
  };
  const order1: BaseOrder = {
    min: strategy.sellMin,
    max: strategy.sellMax,
    marginalPrice: strategy.sellMarginal,
    budget: strategy.sellBudget,
  };

  const { createStrategy, isLoading, isAwaiting, isProcessing } =
    useCreateStrategy({
      type: 'overlapping',
      base,
      quote,
      order0,
      order1,
    });
  const disabled = isLoading || isAwaiting || isProcessing;

  const create = async () => {
    await createStrategy();
    clear();
  };

  return (
    <tr>
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
          {isProcessing || isAwaiting ? 'Processing' : 'Create'}
        </button>
      </td>
    </tr>
  );
};

const StrategyItem: FC<StrategyProps> = ({ base, spread, strategy, clear }) => {
  const { getTokenById } = useTokens();
  const quote = getTokenById(strategy.quote)!;
  const order0: BaseOrder = {
    min: strategy.buyMin,
    max: strategy.buyMax,
    marginalPrice: strategy.buyMarginal,
    budget: strategy.buyBudget,
  };
  const order1: BaseOrder = {
    min: strategy.sellMin,
    max: strategy.sellMax,
    marginalPrice: strategy.sellMarginal,
    budget: strategy.sellBudget,
  };

  const { createStrategy, isLoading, isAwaiting, isProcessing } =
    useCreateStrategy({
      type: 'overlapping',
      base,
      quote,
      order0,
      order1,
    });
  const disabled = isLoading || isAwaiting || isProcessing;

  const create = async () => {
    await createStrategy();
    clear();
  };

  return (
    <li className="strategy-card">
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
        {isProcessing || isAwaiting ? 'Processing' : 'Create'}
      </button>
    </li>
  );
};
