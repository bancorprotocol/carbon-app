import { FC, useState } from 'react';
import { useSetUserApproval } from 'libs/queries/chain/approval';
import { Button } from 'components/common/button';
import { Switch } from 'components/common/switch';
import { ApprovalTokenResult } from 'hooks/useApproval';
import { Imager } from 'components/common/imager/Imager';
import { QueryKey, useQueryClient } from 'libs/queries';
import { useWeb3 } from 'libs/web3';
import { useNotifications } from 'hooks/useNotifications';
import { useTokens } from 'hooks/useTokens';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';

type Props = {
  data?: ApprovalTokenResult;
  isLoading: boolean;
  error: unknown;
};

export const ApproveToken: FC<Props> = ({ data, isLoading, error }) => {
  const { dispatchNotification } = useNotifications();
  const { user } = useWeb3();
  const { getTokenById } = useTokens();
  const token = getTokenById(data?.address || '');
  const mutation = useSetUserApproval();
  const [isLimited, setIsLimited] = useState(false);
  const cache = useQueryClient();
  const [txBusy, setTxBusy] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);

  const onApprove = async () => {
    if (!data || !token) {
      return console.error('No data loaded');
    }
    setTxBusy(true);
    await mutation.mutate(
      { ...data, isLimited },
      {
        onSuccess: async (tx) => {
          dispatchNotification('approve', {
            symbol: token.symbol,
            txHash: tx.hash,
            limited: isLimited,
          });
          await tx.wait();
          setTxSuccess(true);
        },
        onError: () => {
          dispatchNotification('approveError', { symbol: token.symbol });
          console.error('could not set approval');
        },
        onSettled: async () => {
          await cache.refetchQueries({
            queryKey: QueryKey.approval(user!, data.address, data.spender),
          });
          setTxBusy(false);
        },
      }
    );
  };

  if (!data || !token) {
    if (isLoading) {
      return <div>is loading</div>;
    }
    return <div>Unknown Error</div>;
  }

  return (
    <>
      <div
        className={
          'bg-content flex h-85 items-center justify-between rounded px-20'
        }
      >
        <div className={'space-y-6'}>
          <div className={'flex items-center space-x-10'}>
            <Imager
              alt={'Token'}
              src={token.logoURI}
              className={'h-30 w-30 rounded-full'}
            />
            <div className={'font-weight-500'}>{token.symbol}</div>
          </div>
        </div>

        {data.approvalRequired ? (
          txBusy ? (
            <div>please wait</div>
          ) : (
            <div
              className={'flex h-82 flex-col items-end justify-center gap-10'}
            >
              <div className={'flex items-center space-x-8'}>
                <div className={'flex items-center space-x-10'}>
                  <div
                    className={`font-mono text-12 font-weight-500 transition-all ${
                      isLimited ? 'text-white/60' : 'text-white/85'
                    }`}
                  >
                    Unlimited
                  </div>
                  <Switch
                    variant={isLimited ? 'secondary' : 'white'}
                    isOn={!isLimited}
                    setIsOn={(x) => setIsLimited(!x)}
                    size={'sm'}
                  />
                </div>
              </div>

              <Button
                variant={'white'}
                onClick={onApprove}
                size={'sm'}
                className={'px-10 text-14'}
              >
                {data.nullApprovalRequired ? 'Revoke and Approve' : 'Approve'}
              </Button>
            </div>
          )
        ) : (
          <div className={'text-green'}>
            {txSuccess ? 'Approved' : 'Pre-Approved'}
          </div>
        )}

        {error ? <pre>{JSON.stringify(error, null, 2)}</pre> : null}
      </div>
      {data.nullApprovalRequired && (
        <div className={'flex space-x-20 font-mono text-14 text-warning-500'}>
          <div>
            <IconWarning className={'w-16'} />
          </div>
          <span>
            Before you can update your {token.symbol} allowance to {data.amount}
            , the token contract requires you to revoke it first by setting the
            allowance to 0.
          </span>
        </div>
      )}
    </>
  );
};
