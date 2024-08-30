import { useState } from 'react';
import { lsService } from 'services/localeStorage';
import { Button } from 'components/common/button';
import style from './growwrap.module.css';
import { cn } from 'utils/helpers';
import { Warning } from 'components/common/WarningMessageWithIcon';
import currentConfig, { defaultConfig } from 'config';

export const DebugConfig = () => {
  const parsedCurrentConfig = JSON.stringify(
    lsService.getItem('currentConfig'),
    undefined,
    4
  );
  const parsedDefaultConfig = JSON.stringify(defaultConfig, undefined, 4);

  const [config, setConfig] = useState(parsedCurrentConfig);
  const [error, setError] = useState('');

  const errorMessage = 'Failed parsing JSON file';

  const saveConfig = (config?: string) => {
    try {
      if (!config) {
        setConfig('');
        lsService.removeItem('currentConfig');
      } else {
        const parsedConfig = JSON.parse(config || '');
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
    if (e.target.parentNode)
      (e.target.parentNode as HTMLElement).dataset.replicatedValue =
        e.target.value;
  };

  return (
    <div className="rounded-18 bg-background-900 flex flex-col items-center space-y-20 p-20">
      <h2 className="text-center">Set Config</h2>
      <label htmlFor="custom-config-json">Config Override</label>
      {!!error && (
        <Warning isError message={error} htmlFor="custom-config-json" />
      )}

      <div
        data-replicated-value={parsedCurrentConfig}
        className={cn('w-full', style.growwrap)}
      >
        <textarea
          id="custom-config-json"
          className="rounded-18 w-full bg-black px-16 py-8"
          placeholder="Enter a config file in JSON format"
          value={config}
          onChange={handleConfigChange}
          aria-describedby="custom-config-title"
        />
      </div>
      <Button
        data-testid="save-imposter"
        onClick={() => saveConfig(config)}
        fullWidth
      >
        Save
      </Button>
      <Button onClick={() => saveConfig(parsedDefaultConfig)} fullWidth>
        Load Default Config
      </Button>
      <Button onClick={() => saveConfig()} fullWidth>
        Reset
      </Button>
    </div>
  );
};
