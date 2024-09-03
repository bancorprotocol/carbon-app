import { FormEvent, useRef, useState } from 'react';
import { lsService } from 'services/localeStorage';
import { Button } from 'components/common/button';
import style from './growwrap.module.css';
import { cn } from 'utils/helpers';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { defaultConfig } from 'config';
import * as v from 'valibot';
import { AppConfigSchema } from 'config/configSchema';

export const DebugConfig = () => {
  const parsedCurrentConfig = JSON.stringify(
    lsService.getItem('currentConfig'),
    undefined,
    4
  );
  const parsedDefaultConfig = JSON.stringify(defaultConfig, undefined, 4);

  const [config, setConfig] = useState(parsedCurrentConfig);
  const [error, setError] = useState('');
  const parentRef = useRef<HTMLDivElement>(null);

  const errorMessage = 'Failed parsing JSON file';

  const saveConfig = (config?: string) => {
    try {
      if (!config) {
        setConfig('');
        lsService.removeItem('currentConfig');
      } else {
        const parsedConfig = JSON.parse(config || '');
        v.parse(v.partial(AppConfigSchema), parsedConfig);
        lsService.setItem('currentConfig', parsedConfig);
      }
      setError('');
      window?.location.reload();
    } catch (error) {
      setError(errorMessage);
    }
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConfig(e.target.value);
    if (parentRef.current)
      parentRef.current.dataset.replicatedValue = e.target.value;
  };

  const handleLoadDefault = () => {
    setConfig(parsedDefaultConfig);
    if (parentRef.current)
      parentRef.current.dataset.replicatedValue = parsedDefaultConfig;
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    saveConfig(config);
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-18 bg-background-900 flex flex-col items-center space-y-20 p-20"
    >
      <h2 className="text-center">Set Config</h2>
      <label htmlFor="custom-config-json">Config Override</label>

      <div
        ref={parentRef}
        data-replicated-value={parsedCurrentConfig}
        className={cn('w-full', style.growwrap)}
      >
        <textarea
          id="custom-config-json"
          className="rounded-18 bg-black px-16 py-8"
          placeholder="Enter config file overrides in JSON format"
          value={config}
          onChange={handleConfigChange}
          aria-describedby="custom-config-title"
        />
      </div>
      {!!error && (
        <Warning isError message={error} htmlFor="custom-config-json" />
      )}
      <Button data-testid="save-imposter" type="submit" fullWidth>
        Save
      </Button>
      <Button type="button" onClick={handleLoadDefault} fullWidth>
        Load Default Config
      </Button>
      <Button type="button" onClick={() => saveConfig()} fullWidth>
        Reset
      </Button>
    </form>
  );
};
