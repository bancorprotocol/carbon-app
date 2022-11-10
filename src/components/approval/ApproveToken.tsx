import { FC, useState } from 'react';
import {
  SetUserApprovalProps,
  useGetUserApproval,
  useSetUserApproval,
} from 'queries/chain/approval';
import { Button } from 'components/Button';
import { shortenString } from 'utils/helpers';
import { Switch } from 'components/Switch';

export const ApproveToken: FC<SetUserApprovalProps> = (props) => {
  const query = useGetUserApproval(props);
  const mutation = useSetUserApproval();
  const [isUnlimited, setIsUnlimited] = useState(true);

  if (query.isLoading) {
    return <div>is loading</div>;
  }

  if (query.isError) {
    return <div>is error</div>;
  }

  return (
    <div
      className={
        'bg-content flex items-center justify-between rounded px-20 py-12'
      }
    >
      <div className={'space-y-6'}>
        <div className={'flex items-center space-x-10'}>
          <div className={'bg-secondary h-30 w-30 rounded-full'} />
          <div>{props.symbol}</div>
        </div>
        {query.data.lt(props.amount) ? (
          <>
            <div className={'text-secondary'}>
              Allowance: {query.data.toString()}
            </div>

            <div className={'text-secondary'}>
              Spender: {shortenString(props.spenderAddress)}
            </div>
          </>
        ) : null}
      </div>

      {query.data.lt(props.amount) ? (
        mutation.isLoading ? (
          <div>please wait</div>
        ) : (
          <div className={'flex h-82 flex-col items-end justify-between'}>
            <div className={'flex items-center space-x-8'}>
              <div className={'text-secondary'}>Unlimited</div>
              <Switch
                variant={'tertiary'}
                isOn={isUnlimited}
                setIsOn={setIsUnlimited}
                size={'sm'}
              />
            </div>
            <Button onClick={() => mutation.mutate(props)} size={'sm'}>
              Confirm
            </Button>
          </div>
        )
      ) : (
        <div className={'text-success-500'}>approved</div>
      )}

      {mutation.error ? (
        <pre>{JSON.stringify(mutation.error, null, 2)}</pre>
      ) : null}
    </div>
  );
};
