import { Button } from 'components/common/button';
import { useNotifications } from 'hooks/useNotifications';
import { useStore } from 'store';

export const DebugNotifications = () => {
  const { dispatchNotification } = useNotifications();
  const { toaster } = useStore();

  return (
    <div
      className={
        'rounded-18 bg-background-900 flex flex-col items-center space-y-20 p-20'
      }
    >
      <h2>Notifications</h2>

      <Button
        onClick={() =>
          dispatchNotification('generic', {
            title: 'test',
            description: 'test',
            status: 'pending',
            showAlert: true,
            testid: 'generic-test',
          })
        }
      >
        Pending
      </Button>

      <Button
        onClick={() =>
          dispatchNotification('generic', {
            title: 'Pending',
            description: 'this is pending',
            status: 'success',
            successTitle: 'Success',
            successDesc: 'this is a success story',
            showAlert: true,
            testid: 'generic-success',
          })
        }
      >
        Success
      </Button>

      <Button
        onClick={() =>
          dispatchNotification('generic', {
            title: 'Pending',
            description: 'this is pending',
            status: 'failed',
            failedTitle: 'Failed',
            failedDesc: 'this is a failed story',
            showAlert: true,
            testid: 'generic-failed',
          })
        }
      >
        Fail
      </Button>

      <Button
        onClick={() =>
          dispatchNotification('activity', {
            activity: {
              action: 'create',
              strategy: {
                id: '10000',
                base: {
                  address: '0xeeeeeeeeeeeeeeee',
                  decimals: 18,
                  symbol: 'ETH',
                },
                quote: {
                  address: '0xeeeeeeeeeeeeeeee',
                  decimals: 18,
                  symbol: 'USDC',
                },
                owner: '0x312213123111312',
                buy: {
                  min: '1000',
                  max: '2000',
                  budget: '10',
                },
                sell: {
                  min: '1000',
                  max: '2000',
                  budget: '10',
                },
              },
              blockNumber: 10000,
              txHash: '0x1231231323123112313111232123',
              timestamp: 31223121,
              date: new Date('14-04-2024'),
            },
          })
        }
      >
        Activity Create
      </Button>

      <Button
        onClick={() =>
          toaster.addToast(`It is ` + new Date().toLocaleTimeString())
        }
      >
        Open Toast
      </Button>

      <Button onClick={() => dispatchNotification('reject', undefined)}>
        Reject
      </Button>
    </div>
  );
};
