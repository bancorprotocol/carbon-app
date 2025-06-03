import { ChangeEvent, FormEvent } from 'react';
import { Button } from 'components/common/button';
import {
  CreateStrategyParams,
  QueryKey,
  useCreateStrategyQuery,
  useGetTokenBalances,
} from 'libs/queries';
import { FAUCET_TOKENS } from 'utils/tenderly';
import config from 'config';
import { formatNumber, wait } from 'utils/helpers';
import { useMemo, useRef, useState } from 'react';
import { useWagmi } from 'libs/wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { useModal } from 'hooks/useModal';
import { Input, Label } from 'components/common/inputField';
import { Checkbox } from 'components/common/Checkbox/Checkbox';
import { calculateOverlappingPrices } from '@bancor/carbon-sdk/strategy-management';
import { carbonApi } from 'utils/carbonApi';
import { Token } from 'libs/tokens';

const TOKENS = FAUCET_TOKENS.map((tkn) => ({
  address: tkn.tokenContract,
  decimals: tkn.decimals,
  symbol: tkn.symbol,
}));

const gasToken = config.network.gasToken;
TOKENS.push({
  address: gasToken.address,
  decimals: gasToken.decimals,
  symbol: gasToken.symbol,
});

const spender = config.addresses.carbon.carbonController;

export const DebugCreateStrategy = () => {
  const count = useRef(0);
  const { user } = useWagmi();
  const { openModal } = useModal();
  const queryClient = useQueryClient();
  const createMutation = useCreateStrategyQuery();
  const [rounds, setRounds] = useState(1);
  const [index, setIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [interval, setInterval] = useState(0);
  const [allTokens, setAllTokens] = useState(
    TOKENS.map((t) => ({ ...t, selected: false, count: -1 })),
  );
  const [buyMin, setBuyMin] = useState('0');
  const [buyMax, setBuyMax] = useState('0');
  const [buyBudget, setBuyBudget] = useState('0');
  const [sellMin, setSellMin] = useState('0');
  const [sellMax, setSellMax] = useState('0');
  const [sellBudget, setSellBudget] = useState('0');
  const [spread, setSpread] = useState('');
  const selectedTokens = useMemo(() => {
    return allTokens
      .filter((t) => t.selected && t.count > 0)
      .sort((t1, t2) => t1.count - t2.count);
  }, [allTokens]);

  const baseSymbol = selectedTokens?.[0]?.symbol ?? '';
  const quoteSymbol = selectedTokens?.[1]?.symbol ?? '';

  const balanceQueries = useGetTokenBalances(selectedTokens);

  const perRound = 1;

  const selectToken = (token: string) => {
    setAllTokens((prev) => {
      const res = prev.map((t) => {
        if (t.address === token) {
          count.current++;
          return { ...t, selected: !t.selected, count: count.current };
        }
        return t;
      });
      const numberSelected = res.filter((t) => t.selected).length;
      if (numberSelected > 2) {
        return prev;
      }
      return res;
    });
  };

  const balancesMap = useMemo(() => {
    return new Map(
      balanceQueries.map((t, i) => [selectedTokens[i].address, t.data]),
    );
  }, [balanceQueries, selectedTokens]);

  const approvalTokens = useMemo(() => {
    return selectedTokens.map((tkn) => {
      const amount = balancesMap.get(tkn.address) || '0';

      return { ...tkn, spender, amount };
    });
  }, [balancesMap, selectedTokens]);

  const total = useMemo(() => rounds * perRound, [perRound, rounds]);

  const createStrategies = async (e: FormEvent) => {
    e.preventDefault();
    openModal('txConfirm', { approvalTokens, onConfirm: create });
  };

  const getMarketPrice = async (base: Token, quote: Token) => {
    const [basePrice, quotePrice] = await Promise.all([
      carbonApi.getMarketRate(base.address, ['USD']),
      carbonApi.getMarketRate(quote.address, ['USD']),
    ]);
    return basePrice['USD'] / quotePrice['USD'];
  };

  const create = async () => {
    if (!user) throw new Error('user is undefined');
    setIsRunning(true);
    const base = selectedTokens[0];
    const quote = selectedTokens[1];
    const strategy: CreateStrategyParams = {
      base: base.address,
      quote: quote.address,
      order0: {
        max: buyMax,
        min: buyMin,
        marginalPrice: '',
        budget: buyBudget,
      },
      order1: {
        max: sellMax,
        min: sellMin,
        marginalPrice: '',
        budget: sellBudget,
      },
    };
    if (spread) {
      const price = await getMarketPrice(base, quote);
      if (!price) throw new Error('price is undefined');
      const params = calculateOverlappingPrices(
        formatNumber(buyMin),
        formatNumber(sellMax),
        price.toString(),
        spread,
      );
      console.log(params);
      strategy.order0.max = params.buyPriceHigh;
      strategy.order0.marginalPrice = params.buyPriceMarginal;
      strategy.order1.min = params.sellPriceLow;
      strategy.order1.marginalPrice = params.sellPriceMarginal;
    }
    for (let i = 0; i <= rounds - 1; i++) {
      setIndex(i);
      try {
        await createMutation.mutateAsync(strategy);
        await wait(interval * 1000);
        await queryClient.invalidateQueries({
          queryKey: QueryKey.balance(user, base.address),
        });
        await queryClient.invalidateQueries({
          queryKey: QueryKey.balance(user, quote.address),
        });
        console.log('created strategy', strategy.base, strategy.quote);
      } catch (e) {
        console.error(
          'create strategy failed for ',
          'base',
          base.address,
          'quote',
          quote.address,
          e,
        );
      }
    }
    setIsRunning(false);
  };

  const onShortcutChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!e.target.value) return;
    const value = JSON.parse(e.target.value);
    setSpread(value.spread || '');
    const base = allTokens.find((t) => t.symbol === value.base)?.address;
    const quote = allTokens.find((t) => t.symbol === value.quote)?.address;
    if (base) selectToken(base);
    if (quote) selectToken(quote);
    setBuyMin(value.buy.min);
    setBuyMax(value.buy.max);
    setBuyBudget(value.buy.budget);
    setSellMin(value.sell.min);
    setSellMax(value.sell.max);
    setSellBudget(value.sell.budget);
    setRounds(value.amount ? Number(value.amount) : 1);
  };

  return (
    <form
      onSubmit={createStrategies}
      className="rounded-18 bg-background-900 flex flex-col space-y-20 p-20"
    >
      <h2 className="text-center">Create</h2>

      <div className="flex flex-col gap-8">
        <label htmlFor="strategy-json-shortcut">JSON Shortcut</label>
        <textarea
          id="strategy-json-shortcut"
          className="rounded-18 bg-black px-16 py-8"
          placeholder="Enter a Strategy template in JSON format"
          onChange={onShortcutChange}
          aria-describedby="strategy-json-shortcut-description"
          data-testid="strategy-json-shortcut"
        ></textarea>
        <p
          id="strategy-json-shortcut-description"
          className="text-12 text-white/60"
        >
          Used by E2E to prefill the form
        </p>
      </div>

      <fieldset className="flex flex-col gap-16 rounded border border-white/60 p-16">
        <legend>Tokens</legend>
        <ul className="flex flex-col gap-8">
          {allTokens.map((t) => (
            <li
              key={t.address}
              className="rounded-18 flex items-center gap-8 bg-black px-16 py-8"
            >
              <Checkbox
                isChecked={t.selected}
                setIsChecked={() => selectToken(t.address)}
                data-testid={`token-${t.symbol}`}
              />
              <span>{t.symbol}</span>
            </li>
          ))}
        </ul>
        <footer className="flex justify-between">
          <p>{`Base: ${baseSymbol || 'not selected'}`}</p>
          <p>{`Quote: ${quoteSymbol || 'not selected'}`}</p>
        </footer>
      </fieldset>

      <fieldset className="flex flex-col gap-8 rounded border border-white/60 p-16">
        <legend>Liquidity Position Fee Tier</legend>
        <Label label="Spread">
          <Input
            type="text"
            value={spread}
            fullWidth
            onChange={(e) => setSpread(e.target.value)}
            aria-describedby="strategy-spread-description"
            data-testid="spread"
          />
        </Label>
        <p id="strategy-spread-description" className="text-12 text-white/60">
          Spread will create a concentrated liquidity. You still need to set the
          correct budget.
        </p>
      </fieldset>

      <fieldset className="flex flex-col gap-8 rounded border border-white/60 p-16">
        <legend>Buy Low {baseSymbol}</legend>
        <Label label="Min">
          <Input
            type="text"
            value={buyMin}
            fullWidth
            onChange={(e) => setBuyMin(e.target.value)}
            data-testid="buyMin"
          />
        </Label>
        <Label label={`Max ${spread ? '(Disabled)' : ''}`}>
          <Input
            type="text"
            value={buyMax}
            fullWidth
            disabled={!!spread}
            onChange={(e) => setBuyMax(e.target.value)}
            data-testid="buyMax"
          />
        </Label>
        <Label label={`Budget ${quoteSymbol}`}>
          <Input
            type="text"
            value={buyBudget}
            fullWidth
            onChange={(e) => setBuyBudget(e.target.value)}
            data-testid="buyBudget"
          />
        </Label>
      </fieldset>
      <fieldset className="flex flex-col gap-8 rounded border border-white/60 p-16">
        <legend>Sell High {baseSymbol}</legend>
        <Label label={`Min ${spread ? '(Disabled)' : ''}`}>
          <Input
            type="text"
            value={sellMin}
            fullWidth
            disabled={!!spread}
            onChange={(e) => setSellMin(e.target.value)}
            data-testid="sellMin"
          />
        </Label>
        <Label label="Max">
          <Input
            type="text"
            value={sellMax}
            fullWidth
            onChange={(e) => setSellMax(e.target.value)}
            data-testid="sellMax"
          />
        </Label>
        <Label label={`Budget ${baseSymbol}`}>
          <Input
            type="text"
            value={sellBudget}
            fullWidth
            onChange={(e) => setSellBudget(e.target.value)}
            data-testid="sellBudget"
          />
        </Label>
      </fieldset>
      <Label label="How many strategies?">
        <Input
          type="number"
          value={rounds}
          fullWidth
          onChange={(e) => setRounds(Number(e.target.value))}
          data-testid="strategy-amount"
        />
      </Label>
      <Label label="Pause in seconds between creation">
        <Input
          type="number"
          value={interval}
          fullWidth
          onChange={(e) => setInterval(Number(e.target.value))}
        />
      </Label>
      <div>Strategies total: {total}</div>
      {isRunning ? (
        <output data-testid="creating-strategies">
          Strategies created: {index} / {total}
        </output>
      ) : (
        <Button type="submit" data-testid="create-strategies">
          START
        </Button>
      )}
    </form>
  );
};
