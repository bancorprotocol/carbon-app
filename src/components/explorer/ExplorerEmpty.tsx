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
        'flex flex-col items-center justify-center space-y-30 rounded-10 border-2 border-background-800 px-20 py-50 md:h-[500px]'
      )}
    >
      <div
        className={cn(
          'flex h-72 w-72 items-center justify-center rounded-full',
          {
            'bg-primary/20': variant === 'info',
            'bg-error/20': variant === 'error',
          }
        )}
      >
        <IconSearch
          className={cn('h-32 w-32', {
            'text-primary': variant === 'info',
            'text-error': variant === 'error',
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
