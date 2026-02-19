import config from 'config';
import { setNetworkConfig } from 'config/utils';

export const DebugResetDefault = () => {
  const deactivateOne = () => {
    setNetworkConfig();
  };

  return (
    <article className="rounded-3xl surface grid place-items-center gap-40 p-20">
      <h2>Deactivate Debug Mode</h2>
      <button className="btn-main-gradient" onClick={deactivateOne}>
        Deactive for {config.network.name}
      </button>
      <p className="text-main-0/60 text-14 text-center">
        This will only deactivate debug mode
        <br /> for the current network:{' '}
        <b className="text-main-0">{config.network.name}</b>
      </p>
    </article>
  );
};
