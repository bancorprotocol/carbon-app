import { useTranslation } from 'libs/translations';
import { ReactComponent as IconEllipse } from 'assets/icons/ellipse.svg';

export const StrategyNotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="flex h-screen items-center justify-center p-20">
      <div className=" w-[209px] text-center font-weight-500">
        <div className="mx-auto mb-32 w-80 rounded-full bg-silver p-16">
          <IconEllipse />
        </div>
        <div className="text-36">
          {t('pages.strategyOverview.noStrategyCard.content7')}
        </div>
      </div>
    </div>
  );
};
