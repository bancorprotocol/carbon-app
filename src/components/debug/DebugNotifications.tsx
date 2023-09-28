import { Button } from 'components/common/button';
import { useNotifications } from 'hooks/useNotifications';

export const DebugNotifications = () => {
  const { dispatchNotification } = useNotifications();

  return (
    <div
      className={
        'bg-secondary flex flex-col items-center space-y-20 rounded-18 p-20'
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
        Save
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
        Save
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
        Save
      </Button>

      <Button onClick={() => dispatchNotification('reject', undefined)}>
        Reject
      </Button>
    </div>
  );
};
