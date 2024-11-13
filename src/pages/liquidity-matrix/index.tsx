import { flushSync } from 'react-dom';
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
import { FC, FormEvent, useCallback, useEffect, useId } from 'react';
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
import { prettifyNumber } from 'utils/helpers';
import './index.css';

interface GetOrdersParams {
  base: string;
  spread: string;
  concentration: string;
  pairs: PairFormSearch[];
}
const getOrders = (params: GetOrdersParams) => {
  const { base, spread, concentration, pairs } = params;
  const multiplicator = new SafeDecimal(concentration).div(100).add(1);
  return pairs.map((pair) => {
    const { quote, price = '0', baseBudget = '0', quoteBudget = '0' } = pair;
    const min = new SafeDecimal(price).div(multiplicator).toString();
    const max = new SafeDecimal(price).mul(multiplicator).toString();
    const prices = calculateOverlappingPrices(min, max, price, spread);
    const buyBudgetUSD = new SafeDecimal(quoteBudget).mul(price).toString();
    const sellBudgetUSD = new SafeDecimal(baseBudget).mul(price).toString();
    return {
      base,
      quote,
      buyMin: prices.buyPriceLow,
      buyMax: prices.buyPriceHigh,
      buyMarginal: prices.buyPriceMarginal,
      buyBudget: quoteBudget,
      buyBudgetUSD,
      sellMin: prices.sellPriceLow,
      sellMax: prices.sellPriceHigh,
      sellMarginal: prices.sellPriceMarginal,
      sellBudget: baseBudget,
      sellBudgetUSD,
    };
  });
};

const getRatios = (prices: string[]) => {
  const table: string[][] = [];
  for (let i = 0; i < prices.length; i++) {
    table.push([]);
    for (let j = 0; j < prices.length; j++) {
      table[i][j] = new SafeDecimal(prices[i]).div(prices[j]).toString();
    }
  }
  return table;
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
    if (!search.pairs) set({ pairs: [{ quote }] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [set]);

  const base = getTokenById(search.base);
  const basePrice = search.basePrice ?? '1';
  const spread = search.spread ?? '0.01';
  const concentration = search.concentration ?? '5';
  const pairs = search.pairs ?? [];
  const quotes = pairs.map((p) => getTokenById(p.quote)!);
  const ratios = getRatios([basePrice, ...pairs.map((p) => p.price ?? '1')]);

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
      onClick: (token) => set({ base: token.address }),
    });
  };

  const addPair = () => {
    openModal('tokenLists', {
      excludedTokens: [base.address, ...pairs.map((p) => p.quote)],
      onClick: (t) => {
        document.startViewTransition(async () => {
          flushSync(() => {
            set({ pairs: [...pairs, { quote: t.address }] });
          });
        });
      },
    });
  };
  const removeQuote = (address: string) => {
    document.startViewTransition(async () => {
      flushSync(() => {
        set({ pairs: pairs.filter((v) => v.quote !== address) });
      });
    });
  };
  const updatePair = (index: number, params: Partial<PairFormSearch>) => {
    const copy = structuredClone(pairs);
    copy[index] = { ...copy[index], ...params };
    set({ pairs: copy });
  };

  const orders = getOrders({
    base: base.address,
    pairs,
    spread,
    concentration,
  });

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
              <span>Select your base token</span>
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
                value={spread}
                onInput={(e) => set({ spread: e.currentTarget.value })}
                type="number"
                step="0.01"
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
            <div>
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
            <div>
              <h3>Orders</h3>
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
                  {orders.map((order) => {
                    const quote = getTokenById(order.quote)!;
                    return (
                      <tr key={order.quote}>
                        <td>
                          {base.symbol} / {getTokenById(order.quote)?.symbol}
                        </td>
                        <td>{spread}</td>
                        <td>{prettifyNumber(order.buyMin)}</td>
                        <td>{prettifyNumber(order.sellMax)}</td>
                        <td>
                          {prettifyNumber(order.sellBudget)} {base.symbol}&nbsp;
                          <span>
                            ({prettifyNumber(order.sellBudgetUSD)} USD)
                          </span>
                        </td>
                        <td>
                          {prettifyNumber(order.buyBudget)} {quote.symbol}&nbsp;
                          <span>
                            ({prettifyNumber(order.buyBudgetUSD)} USD)
                          </span>
                        </td>
                        <td>
                          <button type="button">Create</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </article>
        )}
      </form>
    </section>
  );
};

interface PairFormProps {
  base: Token;
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

  const setBaseBudget = (sellBudget: string) => {
    const multiplicator = new SafeDecimal(concentration).div(100).add(1);
    const price = pair.price ?? '0';
    const min = new SafeDecimal(price).div(multiplicator).toString();
    const max = new SafeDecimal(price).mul(multiplicator).toString();
    const buyBudget = calculateOverlappingBuyBudget(
      base.decimals,
      quote.decimals,
      min,
      max,
      price,
      spread,
      sellBudget
    );
    update({
      baseBudget: sellBudget,
      quoteBudget: buyBudget,
    });
  };
  const setQuoteBudget = (buyBudget: string) => {
    const multiplicator = new SafeDecimal(concentration).div(100).add(1);
    const price = pair.price ?? '0';
    const min = new SafeDecimal(price).div(multiplicator).toString();
    const max = new SafeDecimal(price).mul(multiplicator).toString();
    const sellBudget = calculateOverlappingSellBudget(
      base.decimals,
      quote.decimals,
      min,
      max,
      price,
      spread,
      buyBudget
    );
    update({
      baseBudget: sellBudget,
      quoteBudget: buyBudget,
    });
  };

  const setBaseBudgetFromUSD = (e: FormEvent<HTMLInputElement>) => {
    const budget = e.currentTarget.valueAsNumber / Number(pair.price ?? 1);
    setBaseBudget(budget.toString());
  };
  const setQuoteBudgetFromUSD = (e: FormEvent<HTMLInputElement>) => {
    const budget = e.currentTarget.valueAsNumber / Number(pair.price ?? 1);
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
              value={Number(pair.baseBudget) * Number(pair.price)}
              onInput={setBaseBudgetFromUSD}
              aria-label="budget in USD"
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
              value={Number(pair.quoteBudget) * Number(pair.price)}
              onInput={setQuoteBudgetFromUSD}
              aria-label="budget in USD"
            />
          </div>
        </div>
      </div>
    </li>
  );
};
