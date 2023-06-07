import { FC } from 'react';
import { carbonEvents } from 'services/events';
import { m } from 'libs/motion';
import { PathNames, useNavigate } from 'libs/routing';
import { Trans, useTranslation } from 'libs/translations';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { SelectTokenButton } from 'components/common/selectToken';
import { UseStrategyCreateReturn } from 'components/strategies/create';
import { items } from './variants';
import { ReactComponent as IconArrow } from 'assets/icons/arrowDown.svg';

export const CreateStrategyTokenSelection: FC<UseStrategyCreateReturn> = ({
  base,
  quote,
  openTokenListModal,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <m.div
      variants={items}
      className="bg-secondary rounded-10 p-20"
      key={'strategyCreateTokenSelection'}
    >
      <div className="mb-14 flex items-center justify-between">
        <h2>{t('pages.strategyCreate.step1.section1.title')}</h2>
        <Tooltip
          sendEventOnMount={{ buy: undefined }}
          element={
            <Trans
              i18nKey={'pages.strategyCreate.step1.tooltips.tooltip1'}
            ></Trans>
          }
        />
      </div>
      <div className={'-space-y-15'}>
        <SelectTokenButton
          symbol={base?.symbol}
          imgUrl={base?.logoURI}
          address={base?.address}
          description={
            t('pages.strategyCreate.step1.section1.content1') || undefined
          }
          onClick={() => openTokenListModal(true)}
          isBaseToken
        />
        {!!base && (
          <>
            <div
              className={
                'relative z-10 mx-auto flex h-40 w-40 items-center justify-center rounded-full border-[5px] border-silver bg-black'
              }
            >
              <IconArrow
                onClick={() => {
                  if (base && quote) {
                    carbonEvents.strategy.strategyTokenSwap({
                      updatedBase: quote.symbol,
                      updatedQuote: base.symbol,
                    });
                    navigate({
                      to: PathNames.createStrategy,
                      search: (search) => ({
                        ...search,
                        base: quote.address,
                        quote: base.address,
                      }),
                      replace: true,
                    });
                  }
                }}
                className={`w-12 ${base && quote ? 'cursor-pointer' : ''}`}
              />
            </div>
            <SelectTokenButton
              symbol={quote?.symbol}
              imgUrl={quote?.logoURI}
              address={quote?.address}
              description={'With'}
              onClick={() => openTokenListModal()}
            />
          </>
        )}
      </div>
    </m.div>
  );
};
