import { FC } from 'react';
import { MainError } from './MainError';

type Props = {
  error: unknown;
  reset: () => void;
};

const getMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'The application hit an unexpected error.';
};

export const AppErrorFallback: FC<Props> = ({ error }) => {
  return (
    <MainError
      title="Something went wrong"
      description={
        <div className="grid gap-8">
          <p>
            We could not render this screen. Don't worry, a quick page refresh
            usually fixes this.
          </p>
          <p className="bg-main-900 border border-error rounded-2xl px-16 py-8 text-left text-14 text-main-0/60 break-words">
            {getMessage(error)}
          </p>
        </div>
      }
    />
  );
};
