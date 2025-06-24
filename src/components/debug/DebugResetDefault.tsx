import { Button } from 'components/common/button';
import { lsService } from 'services/localeStorage';
import config from 'config';

export const DebugResetDefault = () => {
  const deactivateOne = () => {
    lsService.removeItem('imposterAccount');
    lsService.removeItem('tenderlyRpc');
    lsService.removeItem('configOverride');
    lsService.removeItem('carbonApi');
    location.href = location.href;
  };

  return (
    <article className="rounded-18 bg-background-900 flex flex-col items-center space-y-20 p-20">
      <h2>Deactivate Debug Mode</h2>
      <Button variant="success" onClick={deactivateOne}>
        Deactive for {config.network.name}
      </Button>
    </article>
  );
};
