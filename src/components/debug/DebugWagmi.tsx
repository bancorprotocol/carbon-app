import { useWagmi, IS_TENDERLY_FORK } from 'libs/wagmi';
import { shortenString } from 'utils/helpers';

export const DebugWagmi = () => {
  const {
    chainId,
    accountChainId,
    user,
    imposterAccount,
    isNetworkActive,
    networkError,
    isUserBlocked,
  } = useWagmi();

  return (
    <div
      className={
        'rounded-18 bg-background-900 flex flex-col items-center space-y-20 p-20'
      }
    >
      <h2>Wagmi Status</h2>
      <div className="rounded-10 w-full space-y-3 bg-black p-10">
        <div className="flex justify-between">
          <div>ChainID:</div>
          <div>{chainId}</div>
        </div>
        <div className="flex justify-between">
          <div>Account chainID:</div>
          <div>{accountChainId}</div>
        </div>
        <div className="flex justify-between">
          <div>Network Active:</div>
          <div>{isNetworkActive ? 'true' : 'false'}</div>
        </div>
        {networkError && (
          <div className="flex flex-col justify-between">
            <div>Network Error:</div>
            <div>{networkError}</div>
          </div>
        )}
        <div className="flex justify-between">
          <div>Tenderly Fork:</div>
          <div>{IS_TENDERLY_FORK ? 'true' : 'false'}</div>
        </div>
        <div className="flex justify-between">
          <div>User:</div>
          <div>{user ? shortenString(user) : 'Not logged in'}</div>
        </div>
        <div className="flex justify-between">
          <div>Is imposter:</div>
          <div>{!!imposterAccount ? 'true' : 'false'}</div>
        </div>
        <div className="flex justify-between">
          <div>Blocked:</div>
          <div>{isUserBlocked ? 'true' : 'false'}</div>
        </div>
      </div>
    </div>
  );
};
