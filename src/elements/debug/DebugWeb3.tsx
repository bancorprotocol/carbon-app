import { useWeb3 } from 'providers/Web3Provider';
import { shortenString } from 'utils/helpers';
import { IS_TENDERLY_FORK } from 'services/web3/web3.constants';

export const DebugWeb3 = () => {
  const { chainId, user, isImposter, isNetworkActive, networkError } =
    useWeb3();

  return (
    <div className={'min-w-[300px] max-w-fit space-y-3 bg-red-600/10 p-10'}>
      <div className={'flex justify-between'}>
        <div>chainID:</div>
        <div>{chainId}</div>
      </div>
      <div className={'flex justify-between'}>
        <div>isNetworkActive:</div>
        <div>{isNetworkActive ? 'true' : 'false'}</div>
      </div>
      <div className={'flex justify-between'}>
        <div>networkError:</div>
        <div>{networkError ?? 'false'}</div>
      </div>
      <div className={'flex justify-between'}>
        <div>isTenderlyFork:</div>
        <div>{IS_TENDERLY_FORK ? 'true' : 'false'}</div>
      </div>
      <div className={'flex justify-between'}>
        <div>user:</div>
        <div>{user ? shortenString(user) : 'not logged in'}</div>
      </div>
      <div className={'flex justify-between'}>
        <div>isImposter:</div>
        <div>{isImposter ? 'true' : 'false'}</div>
      </div>
    </div>
  );
};
