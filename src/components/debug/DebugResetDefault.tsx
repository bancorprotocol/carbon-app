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
    <article className="rounded-18 bg-background-900 grid place-items-center gap-40 p-20">
      <h2>Deactivate Debug Mode</h2>
      <Button variant="success" onClick={deactivateOne}>
        Deactive for {config.network.name}
      </Button>
      <p className="text-white/60 text-14 text-center">
        This will only deactivate debug mode
        <br /> for the current network:{' '}
        <b className="text-white">{config.network.name}</b>
      </p>
    </article>
  );
};
