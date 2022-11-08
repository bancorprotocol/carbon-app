import { FC } from 'react';
import {
  SetUserApprovalProps,
  useGetUserApproval,
  useSetUserApproval,
} from 'queries/chain/approval';
import { Button } from 'components/Button';
import { shortenString } from 'utils/helpers';

export const ApproveToken: FC<SetUserApprovalProps> = (props) => {
  const query = useGetUserApproval(props);
  const mutation = useSetUserApproval();

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

        <div>Spender: {shortenString(props.spenderAddress)}</div>
      </div>

      <div>
        {query.data.lt(props.amount) ? (
          mutation.isLoading ? (
            <div>please wait</div>
          ) : (
            <Button onClick={() => mutation.mutate(props)} size={'sm'}>
              Confirm
            </Button>
          )
        ) : (
          <div className={'text-success-500'}>all good :)</div>
        )}
      </div>

      {mutation.error ? (
        <pre>{JSON.stringify(mutation.error, null, 2)}</pre>
      ) : null}
    </div>
  );
};
