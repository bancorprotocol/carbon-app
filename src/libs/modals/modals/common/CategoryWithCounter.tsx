import { FC, useId } from 'react';
import { ChooseTokenCategory } from 'libs/modals/modals/ModalTokenList/ModalTokenListContent';
import { cn } from 'utils/helpers';
import style from './CatergoryWithCounter.module.css';

type CategoryWithCounterProps = {
  category: ChooseTokenCategory;
  numOfItemsInCategory: number;
  isActive?: boolean;
};

export const CategoryWithCounter: FC<CategoryWithCounterProps> = ({
  category,
  numOfItemsInCategory,
  isActive = false,
}) => {
  const id = useId();
  return (
    <>
      <input
        id={id}
        type="radio"
        name="category"
        value={category}
        defaultChecked={isActive}
        className={cn(style.radio, 'pointer-events-none absolute opacity-0')}
      />
      <label
        htmlFor={id}
        className={cn(
          'inline-flex flex-1 cursor-pointer items-center justify-center gap-6 capitalize',
          'hover:text-white',
          isActive ? 'font-weight-500' : 'text-14 text-white/60',
        )}
        data-testid={`filter-category-${category}`}
      >
        {category}
        <span className="rounded-full bg-white/10 px-6">
          {numOfItemsInCategory}
        </span>
      </label>
    </>
  );
};
