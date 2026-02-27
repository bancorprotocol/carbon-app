import { FC, FormEvent, useId, useState } from 'react';
import { useSetUserApproval } from 'libs/queries/chain/approval';
import { Switch } from 'components/common/switch';
import { ApprovalTokenResult } from 'hooks/useApproval';
import { TokenLogo } from 'components/common/imager/Imager';
import { QueryKey, useQueryClient } from 'libs/queries';
import { useWagmi } from 'libs/wagmi';
import { useNotifications } from 'hooks/useNotifications';
import { useTokens } from 'hooks/useTokens';
import IconWarning from 'assets/icons/warning.svg?react';
import config from 'config';

type Props = {
  data?: ApprovalTokenResult;
  isPending: boolean;
  error: Error | null;
};

export const ApproveToken: FC<Props> = ({ data, isPending, error }) => {
  const inputId = useId();
  const { dispatchNotification } = useNotifications();
  const { user } = useWagmi();
  const { getTokenById } = useTokens();
  const token = getTokenById(data?.address || '');
  const mutation = useSetUserApproval();
  // When gasprice is cheap, best practice is to use exact amount approval
  const [isLimited, setIsLimited] = useState(
    !!config.network.defaultLimitedApproval,
  );
  const cache = useQueryClient();
  const [txBusy, setTxBusy] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);

  const onApprove = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!data || !token) {
      return console.error('No data loaded');
    }
    setTxBusy(true);
    mutation.mutate(
      { ...data, isLimited },
      {
        onSuccess: async ([approve, revoke]) => {
          if (revoke) {
            dispatchNotification('revoke', {
              txHash: revoke.hash,
            });
          }

          dispatchNotification('approve', {
            symbol: token.symbol,
            txHash: approve.hash,
            limited: isLimited,
          });

          await approve.wait();
          await cache.refetchQueries({
            queryKey: QueryKey.approval(user!, data.address, data.spender),
          });
          setTxBusy(false);
          setTxSuccess(true);
        },
        onError: async () => {
          dispatchNotification('approveError', { symbol: token.symbol });
          console.error('could not set approval');
          await cache.refetchQueries({
            queryKey: QueryKey.approval(user!, data.address, data.spender),
          });
          setTxBusy(false);
        },
      },
    );
  };

  const handleLimitChange = (value: boolean) => {
    setIsLimited(!value);
  };

  if (!data || !token) {
    if (isPending) {
      return <div>Loading...</div>;
    }
    return <div>Unknown Error</div>;
  }

  return (
    <>
      <div className="bg-main-900/80 min-h-85 flex items-center gap-16 justify-between rounded-2xl px-20">
        <div className="flex items-center gap-10">
          <TokenLogo token={token} size={30} />
          <p className="font-medium">{token.symbol}</p>
        </div>

        {data.approvalRequired ? (
          txBusy ? (
            <p className="text-14 text-main-0/80">Waiting for Confirmation</p>
          ) : (
            <form
              onSubmit={onApprove}
              className="flex flex-col items-end justify-center gap-10"
            >
              <div className="flex items-center gap-10">
                <label
                  htmlFor={inputId}
                  className={`text-12 font-medium transition-all ${
                    isLimited ? 'text-main-0/60' : 'text-main-0/85'
                  }`}
                >
                  Unlimited
                </label>
                <Switch
                  id={inputId}
                  checked={!isLimited}
                  onChange={handleLimitChange}
                  data-testid={`approve-limited-${token.symbol}`}
                />
              </div>

              <button
                type="submit"
                className="btn-on-surface text-14 "
                data-testid={`approve-${token.symbol}`}
              >
                {data.nullApprovalRequired ? 'Revoke and Approve' : 'Approve'}
              </button>
            </form>
          )
        ) : (
          <span className="text-primary" data-testid={`msg-${token.symbol}`}>
            {txSuccess ? 'Approved' : 'Pre-Approved'}
          </span>
        )}

        {error ? (
          <output className="max-w-min text-wrap">{error.message}</output>
        ) : null}
      </div>
      {data.nullApprovalRequired && (
        <div className="text-14 text-warning flex gap-16">
          <div>
            <IconWarning className="w-16" />
          </div>
          <span>
            Before updating {token.symbol} allowance, you are required to revoke
            it to 0.
          </span>
        </div>
      )}
    </>
  );
};
