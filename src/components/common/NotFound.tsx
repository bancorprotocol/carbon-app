import { cn } from 'utils/helpers';
import { ReactComponent as IconSearch } from 'assets/icons/search-eye.svg';
import { ReactComponent as ForwardArrow } from 'assets/icons/arrow.svg';
import { useRouter } from '@tanstack/react-router';

export const NotFound = ({
  variant,
  title,
  text,
  bordered = false,
  showBackButton = false,
}: {
  variant: 'info' | 'error';
  title: string;
  text: string;
  bordered?: boolean;
  showBackButton?: boolean;
}) => {
  const { history } = useRouter();

  return (
    <section
      className={cn(
        'relative flex min-h-[500px] flex-col items-center justify-center gap-30 px-20 py-50 text-center',
        bordered && 'rounded border-2 border-background-800'
      )}
    >
      {showBackButton && (
        <button
          onClick={() => history.back()}
          className="absolute top-8 left-8 rounded-full p-16 hover:bg-white/20"
        >
          <ForwardArrow className="h-16 w-16 rotate-180" />
        </button>
      )}
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
