import { Button } from 'components/common/button';
import { FormEvent } from 'react';
import { lsService } from 'services/localeStorage';
import { useStore } from 'store';
import { featureFlags } from 'utils/featureFlags';

export const DebugFeatureFlag = () => {
  const { toaster } = useStore();

  const setFeatureFlags = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const values = data.getAll('flags');
    lsService.setItem('featureFlags', values as string[]);
    if (values.length) toaster.addToast('Enjoy your new superpowers 🔥');
    else toaster.addToast('Features disabled');
  };
  return (
    <form
      onSubmit={setFeatureFlags}
      className="rounded-18 bg-background-800 flex flex-col gap-20 border border-white/60 p-20 md:col-span-2"
    >
      <h2>🧪 Feature Flags</h2>
      {!!featureFlags.length ? <FeatureRadioGroup /> : <EmptyFlags />}
      <Button
        className="self-end"
        variant="success"
        type="submit"
        disabled={!featureFlags.length}
      >
        Save
      </Button>
    </form>
  );
};

const EmptyFlags = () => (
  <p>There is no feature flags for now. Thanks for your interest.</p>
);

const FeatureRadioGroup = () => {
  const currentFlags = lsService.getItem('featureFlags') ?? [];
  return (
    <>
      <fieldset role="radiogroup" className="grid gap-16">
        <legend className="mb-16">
          Select the feature flags you want to test
        </legend>
        {featureFlags.map(({ value, label, description }) => (
          <div
            key={value}
            className="rounded-8 bg-background-700 flex gap-16 p-16"
          >
            <input
              className="h-24 w-24 self-center"
              id={`flag-${value}`}
              type="checkbox"
              name="flags"
              value={value}
              aria-describedby={`flag-description-${value}`}
              defaultChecked={currentFlags.includes(value)}
            />
            <div className="flex flex-1 flex-col">
              <label htmlFor={`flag-${value}`}>{label}</label>
              <p
                id={`flag-description-${value}`}
                className="text-14 text-white/80"
              >
                {description}
              </p>
            </div>
          </div>
        ))}
      </fieldset>
      <p className="text-warning">Disclaimer: beware of the dragons 🐲</p>
    </>
  );
};
