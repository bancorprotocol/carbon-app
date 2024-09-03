import { FormEvent, useRef, useState } from 'react';
import { lsService } from 'services/localeStorage';
import { Button } from 'components/common/button';
import { Warning } from 'components/common/WarningMessageWithIcon';
import style from 'components/debug/DebugConfig/growwrap.module.css';
import { defaultConfig } from 'config';
import { AppConfigSchema } from 'config/configSchema';
import { AppConfig } from 'config/types';
import { cn } from 'utils/helpers';
import * as v from 'valibot';

const formatConfig = (config?: Partial<AppConfig>) =>
  JSON.stringify(config, undefined, 4);

export const DebugConfig = () => {
  const savedConfigOverride = formatConfig(lsService.getItem('configOverride'));
  const [configOverride, setConfigOverride] = useState(savedConfigOverride);
  const [error, setError] = useState('');
  const parentRef = useRef<HTMLDivElement>(null);

  const errorMessage = 'Failed parsing JSON file';
  const saveConfigOverride = (configOverride?: string) => {
    try {
      if (!configOverride) {
        setConfigOverride('');
        lsService.removeItem('configOverride');
      } else {
        const parsedConfig = JSON.parse(configOverride || '');
        v.parse(v.partial(AppConfigSchema), parsedConfig);
        lsService.setItem('configOverride', parsedConfig);
      }
      setError('');
      window?.location.reload();
    } catch (error) {
      setError(errorMessage);
    }
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConfigOverride(e.target.value);
    if (parentRef.current)
      parentRef.current.dataset.replicatedValue = e.target.value;
  };

  const handleLoadDefault = () => {
    const parsedDefaultConfig = formatConfig(defaultConfig);
    setConfigOverride(parsedDefaultConfig);
    if (parentRef.current)
      parentRef.current.dataset.replicatedValue = parsedDefaultConfig;
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    saveConfigOverride(configOverride);
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
        data-replicated-value={savedConfigOverride}
        className={cn('w-full', style.growwrap)}
      >
        <textarea
          id="custom-config-json"
          placeholder="Enter config file overrides in JSON format"
          value={configOverride}
          onChange={handleConfigChange}
          aria-describedby="custom-config-title"
        />
      </div>
      {!!error && (
        <Warning isError message={error} htmlFor="custom-config-json" />
      )}
      <Button data-testid="save-config" type="submit" fullWidth>
        Save
      </Button>
      <Button type="button" onClick={handleLoadDefault} fullWidth>
        Load Default Config
      </Button>
      <Button type="button" onClick={() => saveConfigOverride()} fullWidth>
        Reset
      </Button>
    </form>
  );
};
