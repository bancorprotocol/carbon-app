import { useWeb3 } from 'web3';
import { shortenString } from 'utils/helpers';
import { IS_TENDERLY_FORK } from 'web3/web3.constants';

export const DebugWeb3 = () => {
  const { chainId, user, isImposter, isNetworkActive, networkError } =
    useWeb3();

  return (
    <div>
      <h2>Web3 Status</h2>
      <div
        className={
          'min-w-[300px] max-w-fit space-y-3 rounded-10 bg-red-600/10 p-10 dark:bg-darkGrey'
        }
      >
        <div className={'flex justify-between'}>
          <div>ChainID:</div>
          <div>{chainId}</div>
        </div>
        <div className={'flex justify-between'}>
          <div>Network Active:</div>
          <div>{isNetworkActive ? 'true' : 'false'}</div>
        </div>
        {networkError && (
          <div className={'flex flex-col justify-between'}>
            <div>Network Error:</div>
            <div>{networkError}</div>
          </div>
        )}
        <div className={'flex justify-between'}>
          <div>Tenderly Fork:</div>
          <div>{IS_TENDERLY_FORK ? 'true' : 'false'}</div>
        </div>
        <div className={'flex justify-between'}>
          <div>User:</div>
          <div>{user ? shortenString(user) : 'Not logged in'}</div>
        </div>
        <div className={'flex justify-between'}>
          <div>Imposter:</div>
          <div>{isImposter ? 'true' : 'false'}</div>
        </div>
      </div>
    </div>
  );
};
