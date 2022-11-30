import {
  FAUCET_TOKENS,
  tenderlyFaucetTransferETH,
  tenderlyFaucetTransferTKN,
} from 'utils/tenderly';
import { useWeb3 } from 'web3';
import { useGetTokenBalances } from 'queries/chain/balance';
import { useQueryClient } from '@tanstack/react-query';
import { ethToken } from 'services/web3/config';

const TOKENS = FAUCET_TOKENS.map((tkn) => ({
  address: tkn.tokenContract,
  decimals: tkn.decimals,
}));

TOKENS.push({ address: ethToken, decimals: 18 });

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
      } catch (e) {
        console.error('faucet failed for ', tkn.tokenContract, e);
      }
    }

    await queryClient.invalidateQueries(['balance', user]);
  };

  return (
    <div>
      {queries.map((t, i) => (
        <div key={i}>{t.data}</div>
      ))}
      <button onClick={() => handleOnClick()}>get money</button>
    </div>
  );
};
