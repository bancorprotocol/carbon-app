import { cn } from 'utils/helpers';
import { ReactComponent as IconQuestion } from 'assets/icons/question.svg';
import { ReactComponent as ForwardArrow } from 'assets/icons/arrow.svg';
import { useRouter } from '@tanstack/react-router';
import { FC } from 'react';

interface Props {
  variant: 'info' | 'error';
  title: string;
  text: string;
  bordered?: boolean;
  showBackButton?: boolean;
  className?: string;
}
export const NotFound: FC<Props> = ({
  variant,
  title,
  text,
  bordered = false,
  showBackButton = false,
  className,
}) => {
  const { history } = useRouter();

  return (
    <section
      className={cn(
        'gap-30 py-50 relative flex min-h-[500px] flex-col items-center justify-center px-20 text-center',
        bordered && 'border-background-800 rounded border-2',
        className,
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
        className={cn('rounded-full p-12', {
          'bg-primary/20': variant === 'info',
          'bg-error/20': variant === 'error',
        })}
      >
        <IconQuestion
          className={cn('size-48', {
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
