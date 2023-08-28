import { cn } from 'utils/helpers';
import { ReactComponent as IconSearch } from 'assets/icons/search-eye.svg';

export const ExplorerEmpty = ({
  variant,
  title,
  text,
}: {
  variant: 'info' | 'error';
  title: string;
  text: string;
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center space-y-30 rounded-10 border-2 border-emphasis px-20 py-50 md:h-[500px]'
      )}
    >
      <div
        className={cn(
          'flex h-72 w-72 items-center justify-center rounded-full',
          {
            'bg-green/20': variant === 'info',
            'bg-red/20': variant === 'error',
          }
        )}
      >
        <IconSearch
          className={cn('h-32 w-32', {
            'text-green': variant === 'info',
            'text-red': variant === 'error',
          })}
        />
      </div>
      <h2 className={'max-w-[440px] text-center text-[32px] leading-[36px]'}>
        {title}
      </h2>
      <p className={'text-secondary max-w-[440px] text-center !text-16'}>
        {text}
      </p>
    </div>
  );
};
