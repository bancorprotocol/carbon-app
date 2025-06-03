import { FC, FormEvent, useId, useState } from 'react';
import { useSetUserApproval } from 'libs/queries/chain/approval';
import { Button } from 'components/common/button';
import { Switch } from 'components/common/switch';
import { ApprovalTokenResult } from 'hooks/useApproval';
import { LogoImager } from 'components/common/imager/Imager';
import { QueryKey, useQueryClient } from 'libs/queries';
import { useWagmi } from 'libs/wagmi';
import { useNotifications } from 'hooks/useNotifications';
import { useTokens } from 'hooks/useTokens';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
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
      <div className="bg-content min-h-85 flex items-center justify-between rounded px-20">
        <div className="flex items-center gap-10">
          <LogoImager alt="Token" src={token.logoURI} className="size-30" />
          <p className="font-weight-500">{token.symbol}</p>
        </div>

        {data.approvalRequired ? (
          txBusy ? (
            <div>Waiting for Confirmation</div>
          ) : (
            <form
              onSubmit={onApprove}
              className="flex flex-col items-end justify-center gap-10"
            >
              <div className="flex items-center gap-10">
                <label
                  htmlFor={inputId}
                  className={`text-12 font-weight-500 transition-all ${
                    isLimited ? 'text-white/60' : 'text-white/85'
                  }`}
                >
                  Unlimited
                </label>
                <Switch
                  id={inputId}
                  variant={isLimited ? 'secondary' : 'white'}
                  isOn={!isLimited}
                  setIsOn={handleLimitChange}
                  size="sm"
                  data-testid={`approve-limited-${token.symbol}`}
                />
              </div>

              <Button
                type="submit"
                variant="success"
                size="sm"
                className="text-14 px-10"
                data-testid={`approve-${token.symbol}`}
              >
                {data.nullApprovalRequired ? 'Revoke and Approve' : 'Approve'}
              </Button>
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
        <div className="text-14 text-warning flex space-x-20">
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
