import { ChooseTokenCategory } from 'libs/modals/modals/ModalTokenList/ModalTokenListContent';
import { FC } from 'react';

type CategoryWithCounterProps = {
  category: ChooseTokenCategory;
  numOfItemsInCategory: number;
  setSelectedList: (category: ChooseTokenCategory) => void;
  categoryIndex: number;
  isActive?: boolean;
};

export const CategoryWithCounter: FC<CategoryWithCounterProps> = ({
  category,
  numOfItemsInCategory,
  setSelectedList,
  categoryIndex,
  isActive = false,
}) => {
  return (
    <button
      key={category}
      className={`flex items-end justify-start capitalize transition hover:text-white ${
        isActive ? 'font-weight-500' : 'text-secondary'
      } ${categoryIndex > 0 ? 'justify-center' : ''}`}
      onClick={() => setSelectedList(category)}
    >
      <div className="flex items-center gap-6 ">
        {category}
        <div className={`rounded-full bg-white/10 px-6`}>
          {numOfItemsInCategory}
        </div>
      </div>
    </button>
  );
};
