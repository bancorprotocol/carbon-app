import { Button } from 'components/common/button';
import { useNotifications } from 'hooks/useNotifications';
import { useStore } from 'store';

export const DebugNotifications = () => {
  const { dispatchNotification } = useNotifications();
  const { toaster } = useStore();

  return (
    <div className="rounded-3xl surface flex flex-col items-center gap-20 p-20">
      <h2>Notifications</h2>

      <button
        className="btn-secondary-gradient"
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
      </button>

      <button
        className="btn-secondary-gradient"
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
      </button>

      <button
        className="btn-secondary-gradient"
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
      </button>

      <button
        className="btn-secondary-gradient"
        onClick={() =>
          dispatchNotification('activity', {
            activity: {
              action: 'create',
              strategy: {
                type: 'static',
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
      </button>

      <button
        className="btn-secondary-gradient"
        onClick={() =>
          toaster.addToast(`It is ` + new Date().toLocaleTimeString())
        }
      >
        Open Toast
      </button>

      <button
        className="btn-secondary-gradient"
        onClick={() => dispatchNotification('reject', undefined)}
      >
        Reject
      </button>
    </div>
  );
};
