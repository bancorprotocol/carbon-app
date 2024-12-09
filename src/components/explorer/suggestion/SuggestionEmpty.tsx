import { useId } from 'react';
import { cn } from 'utils/helpers';
import style from './index.module.css';

export const SuggestionEmpty = () => {
  const emptyId = useId();
  return (
    <div className={cn(style.empty, 'px-20 py-16')}>
      <h4 id={emptyId} className="font-weight-500">
        We couldn't find any strategies
      </h4>
      <p className="text-14 text-white/60">
        Please make sure your search input is correct or try searching by a
        different token pair
      </p>
    </div>
  );
};
