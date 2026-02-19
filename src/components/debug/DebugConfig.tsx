import { FormEvent, useLayoutEffect, useRef, useState } from 'react';
import { lsService } from 'services/localeStorage';
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
      className="rounded-3xl surface flex flex-col items-center gap-16 p-20"
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
          className="rounded-3xl w-full break-all bg-main-900 px-16 py-8"
        />
      </div>
      {!!error && (
        <Warning isError message={error} htmlFor="custom-config-json" />
      )}
      <button
        data-testid="save-config"
        type="submit"
        className="btn-main-gradient"
      >
        Save
      </button>
      <button
        type="button"
        onClick={handleLoadDefault}
        className="btn-on-surface"
      >
        Load Default Config
      </button>
      <button type="reset" className="btn-on-surface">
        Reset
      </button>
    </form>
  );
};
