import { FormEvent, useEffect, useState } from 'react';
import { lsService } from 'services/localeStorage';
import { ONE_HOUR_IN_MS } from 'utils/time';
import config from 'config';

const defaultCacheTTL = config.sdk.cacheTTL ?? ONE_HOUR_IN_MS;

export const DebugSDKConfig = () => {
  const [counter, setCounter] = useState(0);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [ttl, setTTL] = useState(defaultCacheTTL);
  const save = (e: FormEvent) => {
    e.preventDefault();
    lsService.setItem('lastSdkCache', { timestamp, ttl });
  };

  useEffect(() => {
    const config = lsService.getItem('lastSdkCache');
    setTimestamp(config?.timestamp ?? Date.now());
    setTTL(config?.ttl ?? defaultCacheTTL);
  }, [counter]);

  return (
    <form
      className="rounded-3xl surface grid content-start gap-20 p-20"
      onSubmit={save}
    >
      <h2>SDK Config</h2>
      <div className="flex flex-col gap-8">
        <label htmlFor="sdk-timestamp">Last Dump Timestamp (ms)</label>
        <div className="flex gap-8">
          <input
            id="sdk-timestamp"
            name="timestamp"
            type="number"
            className="flex-1 rounded-2xl bg-main-900 px-16 py-8"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.valueAsNumber)}
          />
          <button type="button" onClick={() => setCounter(counter + 1)}>
            Refresh
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <label htmlFor="sdk-ttl">Cache TTL (ms)</label>
        <input
          id="sdk-ttl"
          name="ttl"
          type="number"
          className="flex-1 rounded-2xl bg-main-900 px-16 py-8"
          value={ttl}
          onChange={(e) => setTTL(e.target.valueAsNumber)}
        />
      </div>
      <button className="btn-primary-gradient" type="submit">
        Save Config
      </button>
    </form>
  );
};
