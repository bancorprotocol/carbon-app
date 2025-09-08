import { FormEvent, useLayoutEffect, useRef, useState } from 'react';
import { lsService } from 'services/localeStorage';
import { Button } from 'components/common/button';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { defaultConfig } from 'config';
import { AppConfig } from 'config/types';
import { setNetworkConfig } from 'config/utils';

const formatConfig = (config?: Partial<AppConfig>) =>
  JSON.stringify(config, undefined, 4);

export const DebugConfig = () => {
  const savedConfigOverride = formatConfig(lsService.getItem('configOverride'));
  const [configOverride, setConfigOverride] = useState(savedConfigOverride);
  const [error, setError] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const errorMessage = 'Failed parsing JSON file';
  const saveConfigOverride = (configOverride?: string) => {
    try {
      if (!configOverride) setConfigOverride('');
      setNetworkConfig(configOverride);
    } catch (error) {
      console.log(error);
      setError(errorMessage);
    }
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConfigOverride(e.target.value);
  };

  useLayoutEffect(() => {
    if (!textAreaRef.current) return;
    textAreaRef.current.style.height = 'inherit'; // to reduce on delete
    const defaultHeight = 5; // px
    const newHeight = Math.max(textAreaRef.current.scrollHeight, defaultHeight); // px
    textAreaRef.current.style.height = `${newHeight}px`;
  }, [configOverride]);

  const handleLoadDefault = () => {
    const parsedDefaultConfig = formatConfig(defaultConfig);
    setConfigOverride(parsedDefaultConfig);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    saveConfigOverride(configOverride);
  };

  const reset = (e: FormEvent) => {
    e.preventDefault();
    saveConfigOverride();
  };

  return (
    <form
      onSubmit={submit}
      onReset={reset}
      className="rounded-3xl bg-background-900 flex flex-col items-center space-y-20 p-20"
    >
      <h2 className="text-center">Set Config</h2>
      <label htmlFor="custom-config-json">Config Override</label>

      <div className="w-full">
        <textarea
          ref={textAreaRef}
          id="custom-config-json"
          placeholder="Enter config file overrides in JSON format"
          value={configOverride}
          onChange={handleConfigChange}
          className="rounded-3xl w-full break-all bg-black px-16 py-8"
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
      <Button type="reset" fullWidth>
        Reset
      </Button>
    </form>
  );
};
