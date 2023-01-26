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
        onSuccess: async (tx, variables) => {
          dispatchNotification('approve', {
            symbol: token.symbol,
            txHash: tx.hash,
            limited: isLimited,
          });
          await tx.wait();
          void cache.invalidateQueries({
            queryKey: QueryKey.approval(
              user!,
              variables.address,
              variables.spender
            ),
          });
          setTxBusy(false);
          setTxSuccess(true);
        },
        onError: () => {
          // TODO: proper error handling
          console.error('could not set approval');
          setTxBusy(false);
        },
      }
    );
  };

  // TODO handle error
  if (!data || !token) {
    if (isLoading) {
      return <div>is loading</div>;
    }
    return <div>error</div>;
  }

  return (
    <div
      className={
        'bg-content flex items-center justify-between rounded px-20 py-12'
      }
    >
      <div className={'space-y-6'}>
        <div className={'flex items-center space-x-10'}>
          <Imager
            alt={'Token'}
            src={token.logoURI}
            className={'h-30 w-30 rounded-full'}
          />
          <div>{token.symbol}</div>
        </div>
      </div>

      {data.approvalRequired && !txSuccess ? (
        txBusy ? (
          <div>please wait</div>
        ) : (
          <div className={'flex h-82 flex-col items-end justify-center gap-10'}>
            <div className={'flex items-center space-x-8'}>
              <div
                className={`!text-12 ${
                  isLimited ? 'text-white' : 'text-secondary'
                }`}
              >
                Limited
              </div>
              <Switch
                variant={'secondary'}
                isOn={isLimited}
                setIsOn={setIsLimited}
                size={'sm'}
              />
            </div>
            <Button variant={'white'} onClick={onApprove} size={'sm'}>
              Confirm
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
  );
};
