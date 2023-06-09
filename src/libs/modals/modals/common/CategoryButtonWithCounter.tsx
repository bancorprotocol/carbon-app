import { FC, useMemo } from 'react';
import { ChooseTokenCategory } from 'libs/modals/modals/ModalTokenList/ModalTokenListContent';
import { useTranslation } from 'libs/translations';

type CategoryWithCounterProps = {
  category: ChooseTokenCategory;
  numOfItemsInCategory: number;
  setSelectedList: (category: ChooseTokenCategory) => void;
  categoryIndex: number;
  isActive?: boolean;
};

export const CategoryButtonWithCounter: FC<CategoryWithCounterProps> = ({
  category,
  numOfItemsInCategory,
  setSelectedList,
  categoryIndex,
  isActive = false,
}) => {
  const { t } = useTranslation();

  const translatedCategory = useMemo(() => {
    if (category === 'popular') {
      return t('common.contents.content5');
    }
    if (category === 'favorites') {
      return t('common.contents.content6');
    }

    return t('common.contents.content7');
  }, [category, t]);

  return (
    <button
      className={`flex items-end justify-start capitalize transition hover:text-white ${
        isActive ? 'font-weight-500' : 'text-secondary'
      } ${categoryIndex > 0 ? 'justify-center' : ''}`}
      onClick={() => setSelectedList(category)}
    >
      <div className="flex items-center gap-6 ">
        {translatedCategory}
        <div className={`rounded-full bg-white/10 px-6`}>
          {numOfItemsInCategory}
        </div>
      </div>
    </button>
  );
};
