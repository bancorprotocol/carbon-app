import {
  FAUCET_TOKENS,
  FaucetToken,
  tenderlyFaucetTransferNativeToken,
  tenderlyFaucetTransferTKN,
} from 'utils/tenderly';
import { useWagmi } from 'libs/wagmi';
import { useGetTokenBalances } from 'libs/queries/chain/balance';
import { useQueryClient } from '@tanstack/react-query';
import config from 'config';
import { Button } from 'components/common/button';
import { QueryKey } from 'libs/queries';
import { FormEvent } from 'react';
import { NATIVE_TOKEN_ADDRESS } from 'utils/tokens';

const TOKENS = FAUCET_TOKENS.map((tkn) => ({
  address: tkn.tokenContract,
  decimals: tkn.decimals,
  symbol: tkn.symbol,
}));

const gasToken = config.network.gasToken;
TOKENS.push({
  address: NATIVE_TOKEN_ADDRESS,
  decimals: gasToken.decimals,
  symbol: gasToken.symbol,
});

export const DebugTenderlyFaucet = () => {
  const { user } = useWagmi();
  const queryClient = useQueryClient();
  const queries = useGetTokenBalances(TOKENS);

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error('user is undefined');
      return;
    }

    for (const tkn of TOKENS) {
      console.log('Token', tkn);
      tenderlyFaucetTransferTKN(tkn, user)
        .then(() => {
          const queryKey = QueryKey.balance(user, tkn.address);
          queryClient.invalidateQueries({ queryKey });
        })
        .catch((err) => {
          console.error('faucet failed for ', tkn.address, err);
        });
    }
  };

  const addOne = async (tkn: (typeof TOKENS)[number]) => {
    if (!user) return console.error('user is undefined');
    try {
      await tenderlyFaucetTransferTKN(tkn, user);
      const queryKey = QueryKey.balance(user, tkn.address);
      queryClient.invalidateQueries({ queryKey });
    } catch (err) {
      console.error('faucet failed for ', tkn.address, err);
    }
  };

  return (
    <form
      className="rounded-18 bg-background-900 flex flex-col items-center space-y-20 p-20"
      onSubmit={handleOnSubmit}
    >
      <h2>Tenderly Faucet</h2>

      <ul className="grid gap-8">
        {queries.map((t, i) => {
          const symbol = TOKENS[i].symbol;
          return (
            <li className="flex gap-8 items-center" key={i}>
              {!!t.data && t.data !== '0' && (
                <span data-testid={`balance-${symbol}`}>{t.data}</span>
              )}
              <span>{symbol}</span>
              <button
                className="text-12 border border-white/60 rounded px-8 py-4 cursor-pointer disabled:text-white/60"
                type="button"
                disabled={!user}
                onClick={() => addOne(TOKENS[i])}
                data-testid={`add-${symbol}`}
              >
                Add
              </button>
            </li>
          );
        })}
      </ul>

      <Button type="submit">Get money</Button>
    </form>
  );
};
