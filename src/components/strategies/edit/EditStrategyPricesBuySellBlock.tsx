import { FC } from 'react';
import { Token } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { LimitRangeSection } from 'components/strategies/create/BuySellBlock/LimitRangeSection';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { EditTypes } from './EditStrategyMain';
import { EditStrategyAllocatedBudget } from './EditStrategyAllocatedBudget';

type EditStrategyPricesBuySellBlockProps = {
  base: Token;
  quote: Token;
  order: OrderCreate;
  balance?: string;
  buy?: boolean;
  type: EditTypes;
  isOrdersOverlap: boolean;
};

export const EditStrategyPricesBuySellBlock: FC<
  EditStrategyPricesBuySellBlockProps
> = ({ base, quote, balance, buy, order, type, isOrdersOverlap }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`bg-secondary w-full rounded-6 border-l-2 p-20 text-12 ${
        buy
          ? 'border-green/50 focus-within:border-green'
          : 'border-red/50 focus-within:border-red'
      }`}
    >
      <LimitRangeSection
        {...{
          base,
          quote,
          balance,
          buy,
          order,
          isOrdersOverlap,
          title: buy
            ? t('pages.strategyEdit.section2.titles.title5', {
                token: base.symbol,
              })
            : t('pages.strategyEdit.section2.titles.title6', {
                token: base.symbol,
              }),
          inputTitle: (
            <div className="text-white/60">
              {buy
                ? t('pages.strategyEdit.section2.subtitles.subtitle1')
                : t('pages.strategyEdit.section2.subtitles.subtitle2')}{' '}
              <span className={'text-white/80'}>
                ({quote.symbol}{' '}
                <span className="text-white/60">
                  {t('pages.strategyEdit.section2.contents.content12')}{' '}
                </span>
                {base.symbol})
              </span>
            </div>
          ),
        }}
      />
      <div className="pt-10">
        <EditStrategyAllocatedBudget
          {...{
            order,
            base,
            quote,
            balance,
            buy,
            type,
          }}
        />
      </div>
    </div>
  );
};
