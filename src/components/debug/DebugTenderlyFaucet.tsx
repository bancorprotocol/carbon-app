import {
  FAUCET_TOKENS,
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

    await tenderlyFaucetTransferNativeToken(user);
    queryClient.invalidateQueries({
      queryKey: QueryKey.balance(user, NATIVE_TOKEN_ADDRESS),
    });

    for (const tkn of FAUCET_TOKENS) {
      console.log('Token', tkn);
      tenderlyFaucetTransferTKN(tkn, user)
        .then(() => {
          const queryKey = QueryKey.balance(user, tkn.tokenContract);
          queryClient.invalidateQueries({ queryKey });
        })
        .catch((err) => {
          console.error('faucet failed for ', tkn.tokenContract, err);
        });
    }
  };

  return (
    <form
      className="rounded-18 bg-background-900 flex flex-col items-center space-y-20 p-20"
      onSubmit={handleOnSubmit}
    >
      <h2>Tenderly Faucet</h2>

      <ul>
        {queries.map((t, i) => (
          <li key={i}>
            {!!t.data && t.data !== '0' && (
              <span data-testid={`balance-${TOKENS[i].symbol}`}>{t.data}</span>
            )}
            <span> {TOKENS[i].symbol}</span>
          </li>
        ))}
      </ul>

      <Button type="submit">Get money</Button>
    </form>
  );
};
