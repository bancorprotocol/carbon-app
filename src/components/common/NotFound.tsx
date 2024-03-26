import { cn } from 'utils/helpers';
import { ReactComponent as IconSearch } from 'assets/icons/search-eye.svg';

export const NotFound = ({
  variant,
  title,
  text,
  bordered = false,
}: {
  variant: 'info' | 'error';
  title: string;
  text: string;
  bordered?: boolean;
}) => {
  return (
    <section
      className={cn(
        'flex min-h-[500px] flex-col items-center justify-center gap-30 px-20 py-50 text-center',
        bordered && 'rounded border-2 border-background-800'
      )}
    >
      <div
        className={cn('rounded-full p-20', {
          'bg-primary/20': variant === 'info',
          'bg-error/20': variant === 'error',
        })}
      >
        <IconSearch
          className={cn('h-32 w-32', {
            'text-primary': variant === 'info',
            'text-error': variant === 'error',
          })}
        />
      </div>
      <h2 className="max-w-[440px] text-[32px] leading-[36px]">{title}</h2>
      <p className="max-w-[440px] text-16 text-white/60">{text}</p>
    </section>
  );
};
