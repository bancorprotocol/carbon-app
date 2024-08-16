import { useNavigate } from '@tanstack/react-router';
import { Button } from 'components/common/button';
import { FC, ReactNode, FormEvent } from 'react';
import style from 'components/strategies/common/stepper.module.css';
import { cn } from 'utils/helpers';

interface Props {
  from: string;
  to: string;
  variant?: 'buy' | 'sell' | 'success';
  nextPage: string;
  children: ReactNode;
}
export const CreateStepper: FC<Props> = (props) => {
  const { children, from, to, variant = 'success', nextPage } = props;
  const navigate = useNavigate({ from });
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) return;
    if (!!form.querySelector('.loading-message')) return;
    if (!!form.querySelector('.error-message')) return;
    navigate({ to, params: true, search: true });
  };
  return (
    <form
      className={cn('flex flex-1 flex-col gap-20', style.stepper)}
      onSubmit={submit}
      data-testid="create-strategy-step"
    >
      {children}
      <Button
        type="submit"
        variant={variant}
        className={cn('mt-auto shrink-0', style.next)}
        data-testid="next-step"
      >
        Next Step: {nextPage}
      </Button>
    </form>
  );
};
