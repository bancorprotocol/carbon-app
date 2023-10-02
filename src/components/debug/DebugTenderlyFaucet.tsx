import {
  FAUCET_TOKENS,
  tenderlyFaucetTransferETH,
  tenderlyFaucetTransferTKN,
} from 'utils/tenderly';
import { useWeb3 } from 'libs/web3';
import { useGetTokenBalances } from 'libs/queries/chain/balance';
import { useQueryClient } from '@tanstack/react-query';
import { config } from 'services/web3/config';
import { Button } from 'components/common/button';
import { QueryKey } from 'libs/queries';
import { FormEvent } from 'react';

const TOKENS = FAUCET_TOKENS.map((tkn) => ({
  address: tkn.tokenContract,
  decimals: tkn.decimals,
  symbol: tkn.symbol,
}));

TOKENS.push({ address: config.tokens.ETH, decimals: 18, symbol: 'ETH' });

export const DebugTenderlyFaucet = () => {
  const { user } = useWeb3();
  const queryClient = useQueryClient();
  const queries = useGetTokenBalances(TOKENS);

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error('user is undefined');
      return;
    }

    await tenderlyFaucetTransferETH(user);
    await queryClient.invalidateQueries({
      queryKey: QueryKey.balance(user, config.tokens.ETH),
    });

    for (const tkn of FAUCET_TOKENS) {
      console.log('Token', tkn);
      tenderlyFaucetTransferTKN(tkn, user)
        .then(() => {
          const queryKey = QueryKey.balance(user, tkn.tokenContract);
          return queryClient.invalidateQueries({ queryKey });
        })
        .catch((e) =>
          console.error('faucet failed for ', tkn.tokenContract, e)
        );
    }
  };

  return (
    <form
      className="bg-secondary flex flex-col items-center space-y-20 rounded-18 p-20"
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
