import { useId } from 'react';
import { cn } from 'utils/helpers';
import { suggestionClasses } from './utils';
import style from './index.module.css';

export const SuggestionEmpty = () => {
  const emptyId = useId();
  return (
    <article
      aria-labelledby={emptyId}
      className={cn(suggestionClasses, style.empty, 'px-20')}
    >
      <h3 className="text-14 font-weight-500 mb-8 text-white/60">0 Results</h3>
      <h4 id={emptyId} className="font-weight-500">
        We couldn't find any strategies
      </h4>
      <p className="text-14 text-white/60">
        Please make sure your search input is correct or try searching by a
        different token pair
      </p>
    </article>
  );
};
