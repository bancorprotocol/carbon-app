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
        'gap-30 py-50 relative flex min-h-[500px] flex-col items-center justify-center px-20 text-center',
        bordered && 'border-background-800 rounded border-2'
      )}
    >
      {showBackButton && (
        <button
          onClick={() => history.back()}
          className="absolute left-8 top-8 rounded-full p-16 hover:bg-white/20"
        >
          <ForwardArrow className="size-16 rotate-180" />
        </button>
      )}
      <div
        className={cn('rounded-full p-20', {
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
      <h2 className="max-w-[440px] text-[32px] leading-[36px]">{title}</h2>
      <p className="text-16 max-w-[440px] text-white/60">{text}</p>
    </section>
  );
};
