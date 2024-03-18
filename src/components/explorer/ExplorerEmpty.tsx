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
        'space-y-30 rounded-10 border-background-800 py-50 flex flex-col items-center justify-center border-2 px-20 md:h-[500px]'
      )}
    >
      <div
        className={cn('flex size-72 items-center justify-center rounded-full', {
          'bg-primary/20': variant === 'info',
          'bg-error/20': variant === 'error',
        })}
      >
        <IconSearch
          className={cn('size-32', {
            'text-primary': variant === 'info',
            'text-error': variant === 'error',
          })}
        />
      </div>
      <h2 className="max-w-[440px] text-center text-[32px] leading-[36px]">
        {title}
      </h2>
      <p className="text-secondary !text-16 max-w-[440px] text-center">
        {text}
      </p>
    </div>
  );
};
