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
import { carbonEvents } from 'services/events';
import {
  TokenApprovalType,
  StrategyEventOrTradeEvent,
  StrategyEventType,
  TradeEventType,
} from 'services/events/types';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { useTranslation } from 'libs/translations';

type Props = {
  data?: ApprovalTokenResult;
  isLoading: boolean;
  error: unknown;
  eventData?: StrategyEventOrTradeEvent & TokenApprovalType;
  context?: 'depositStrategyFunds' | 'createStrategy' | 'trade';
};

export const ApproveToken: FC<Props> = ({
  data,
  isLoading,
  error,
  eventData,
  context,
}) => {
  const { t } = useTranslation();
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
    mutation.mutate(
      { ...data, isLimited },
      {
        onSuccess: async ([approve, revoke]) => {
          revoke &&
            dispatchNotification('revoke', {
              txHash: revoke.hash,
            });

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
          handleTokenConfirmationApproveEvent();
        },
        onError: async () => {
          dispatchNotification('approveError', { symbol: token.symbol });
          console.error('could not set approval');
          await cache.refetchQueries({
            queryKey: QueryKey.approval(user!, data.address, data.spender),
          });
          setTxBusy(false);
        },
      }
    );
  };

  const handleLimitChange = (value: boolean) => {
    setIsLimited(!value);
    handleTokenConfirmationEvent(value);
  };

  const handleTokenConfirmationApproveEvent = () => {
    if (eventData && token) {
      switch (context) {
        case 'createStrategy':
          carbonEvents.tokenApproval.tokenConfirmationUnlimitedApproveStrategyCreate(
            {
              ...eventData,
              approvalTokens: [token],
              isLimited,
            } as StrategyEventType & TokenApprovalType
          );
          break;
        case 'depositStrategyFunds':
          carbonEvents.tokenApproval.tokenConfirmationUnlimitedApproveDepositStrategyFunds(
            {
              ...eventData,
              approvalTokens: [token],
              isLimited,
            } as StrategyEventType & TokenApprovalType
          );
          break;
        case 'trade':
          carbonEvents.tokenApproval.tokenConfirmationUnlimitedApproveTrade({
            ...eventData,
            approvalTokens: [token],
            isLimited,
          } as TradeEventType & TokenApprovalType);
          break;
        default:
          break;
      }
    }
  };

  const handleTokenConfirmationEvent = (value: boolean) => {
    if (eventData) {
      switch (context) {
        case 'createStrategy':
          carbonEvents.tokenApproval.tokenConfirmationUnlimitedSwitchChangeStrategyCreate(
            {
              ...eventData,
              isLimited: !value,
            } as StrategyEventType & TokenApprovalType
          );
          break;
        case 'depositStrategyFunds':
          carbonEvents.tokenApproval.tokenConfirmationUnlimitedSwitchChangeDepositStrategyFunds(
            {
              ...eventData,
              isLimited: !value,
            } as StrategyEventType & TokenApprovalType
          );

          break;
        case 'trade':
          carbonEvents.tokenApproval.tokenConfirmationUnlimitedSwitchChangeTrade(
            {
              ...eventData,
              isLimited: !value,
            } as TradeEventType & TokenApprovalType
          );

          break;
        default:
          break;
      }
    }
  };

  if (!data || !token) {
    if (isLoading) {
      return <div>{t('modals.confirm.contents.content2')}</div>;
    }
    return <div>{t('modals.confirm.contents.content3')}</div>;
  }

  return (
    <>
      <div
        className={
          'bg-content flex h-85 items-center justify-between rounded px-20'
        }
      >
        <div className={'space-y-6'}>
          <div className={'flex items-center space-s-10'}>
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
            <div>{t('modals.confirm.statuses.status1')}</div>
          ) : (
            <div
              className={'flex h-82 flex-col items-end justify-center gap-10'}
            >
              <div className={'flex items-center space-s-8'}>
                <div className={'flex items-center space-s-10'}>
                  <div
                    className={`font-mono text-12 font-weight-500 transition-all ${
                      isLimited ? 'text-white/60' : 'text-white/85'
                    }`}
                  >
                    {t('modals.confirm.actionButtons.actionButton2')}
                  </div>
                  <Switch
                    variant={isLimited ? 'secondary' : 'white'}
                    isOn={!isLimited}
                    setIsOn={handleLimitChange}
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
                {data.nullApprovalRequired
                  ? t('modals.confirm.actionButtons.actionButton4')
                  : t('modals.confirm.actionButtons.actionButton3')}
              </Button>
            </div>
          )
        ) : (
          <div className={'text-green'}>
            {txSuccess
              ? t('modals.confirm.statuses.status2')
              : t('modals.confirm.statuses.status3')}
          </div>
        )}

        {error ? <pre>{JSON.stringify(error, null, 2)}</pre> : null}
      </div>
      {data.nullApprovalRequired && (
        <div className={'flex font-mono text-14 text-warning-500 space-s-20'}>
          <div>
            <IconWarning className={'w-16'} />
          </div>
          <span>
            {t('modals.confirm.contents.content1', { token: token.symbol })}
          </span>
        </div>
      )}
    </>
  );
};
