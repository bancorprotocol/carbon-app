import { useWeb3 } from 'libs/web3';
import { shortenString } from 'utils/helpers';
import { IS_TENDERLY_FORK } from 'libs/web3/web3.constants';

export const DebugWeb3 = () => {
  const {
    chainId,
    user,
    isImposter,
    isNetworkActive,
    networkError,
    isUserBlocked,
  } = useWeb3();

  return (
    <div
      className={
        'bg-secondary flex flex-col items-center space-y-20 rounded-18 p-20'
      }
    >
      <h2>Web3 Status</h2>
      <div className={'bg-body w-full space-y-3 rounded-10 p-10'}>
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
        <div className={'flex justify-between'}>
          <div>Blocked:</div>
          <div>{isUserBlocked ? 'true' : 'false'}</div>
        </div>
      </div>
    </div>
  );
};
