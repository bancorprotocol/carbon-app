import {
  FAUCET_TOKENS,
  tenderlyFaucetTransferETH,
  tenderlyFaucetTransferTKN,
} from 'utils/tenderly';
import { useWeb3 } from 'web3';
import { useGetTokenBalances } from 'queries/chain/balance';
import { useQueryClient } from '@tanstack/react-query';
import { config } from 'services/web3/config';
import { Button } from 'components/Button';
import { QueryKey } from '../../queries';

const TOKENS = FAUCET_TOKENS.map((tkn) => ({
  address: tkn.tokenContract,
  decimals: tkn.decimals,
}));

TOKENS.push({ address: config.tokens.ETH, decimals: 18 });

export const DebugTenderlyFaucet = () => {
  const { user } = useWeb3();
  const queryClient = useQueryClient();
  const queries = useGetTokenBalances(TOKENS);

  const handleOnClick = async () => {
    if (!user) {
      console.error('user is undefined');
      return;
    }

    await tenderlyFaucetTransferETH(user);

    for await (const tkn of FAUCET_TOKENS) {
      try {
        await tenderlyFaucetTransferTKN(tkn, user);
        await queryClient.invalidateQueries({
          queryKey: QueryKey.balance(user, tkn.tokenContract),
        });
      } catch (e) {
        console.error('faucet failed for ', tkn.tokenContract, e);
      }
    }
  };

  return (
    <div
      className={
        'bg-secondary flex flex-col items-center space-y-20 rounded-18 p-20'
      }
    >
      <h2>Tenderly Faucet</h2>

      <div>
        {queries.map((t, i) => (
          <div key={i}>{t.data}</div>
        ))}
      </div>

      <Button onClick={handleOnClick}>Get money</Button>
    </div>
  );
};
