import { FC, useId } from 'react';
import { cn } from 'utils/helpers';
import { suggestionClasses } from './utils';

export const SuggestionEmpty: FC = () => {
  const emptyId = useId();
  return (
    <article
      aria-labelledby={emptyId}
      className={cn(suggestionClasses, 'px-20')}
    >
      <h3 className="text-secondary mb-8 font-weight-500">0 Results</h3>
      <h4 id={emptyId} className={'font-weight-500'}>
        We couldn't find any strategies
      </h4>
      <p className={'text-secondary'}>
        Please make sure your search input is correct or try searching by a
        different token pair
      </p>
    </article>
  );
};
