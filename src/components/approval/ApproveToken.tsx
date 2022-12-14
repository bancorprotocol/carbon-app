import { FC, useState } from 'react';
import { useSetUserApproval } from 'queries/chain/approval';
import { Button } from 'components/Button';
import { shortenString } from 'utils/helpers';
import { Switch } from 'components/Switch';
import { ApprovalTokenResult } from 'hooks/useApproval';
import { Imager } from 'elements/Imager';

type Props = {
  data?: ApprovalTokenResult;
  isLoading: boolean;
  error: unknown;
};

export const ApproveToken: FC<Props> = ({ data, isLoading, error }) => {
  const mutation = useSetUserApproval();
  const [isLimited, setIsLimited] = useState(false);

  // TODO handle error
  if (!data) {
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
            src={data.token.logoURI}
            className={'h-30 w-30 rounded-full'}
          />
          <div>{data.token.symbol}</div>
        </div>
        {data.approvalRequired ? (
          <>
            <div className={'text-secondary'}>Allowance: {data.allowance}</div>

            <div className={'text-secondary'}>
              Spender: {shortenString(data.spenderAddress)}
            </div>
          </>
        ) : null}
      </div>

      {data.approvalRequired ? (
        mutation.isLoading ? (
          <div>Approving...</div>
        ) : (
          <div className={'flex h-82 flex-col items-end justify-between'}>
            <div className={'flex items-center space-x-8'}>
              <div
                className={`!text-12 ${
                  isLimited ? 'text-white' : 'text-secondary'
                }`}
              >
                Limited
              </div>
              <Switch
                variant={'tertiary'}
                isOn={isLimited}
                setIsOn={setIsLimited}
                size={'sm'}
              />
            </div>
            <Button
              variant={'secondary'}
              onClick={() => mutation.mutate(data)}
              size={'sm'}
            >
              Approve
            </Button>
          </div>
        )
      ) : (
        <div className={'text-success-500'}>Approved</div>
      )}

      {error ? <pre>{JSON.stringify(error, null, 2)}</pre> : null}
    </div>
  );
};
