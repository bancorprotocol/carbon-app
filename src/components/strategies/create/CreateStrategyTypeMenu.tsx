import { FC, ReactNode } from 'react';
import { carbonEvents } from 'services/events';
import { useTranslation } from 'libs/translations';
import { m } from 'libs/motion';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { Button } from 'components/common/button';
import { items } from 'components/strategies/create/variants';
import { UseStrategyCreateReturn } from 'components/strategies/create/index';
import { useCreateStrategyTypeMenu } from 'components/strategies/create/useCreateStrategyTypeMenu';
import { ReactComponent as IconArrowsTransparent } from 'assets/icons/arrows-transparent.svg';
import { ReactComponent as IconArrows } from 'assets/icons/arrows.svg';

const BlockIconTextDesc = ({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className={'space-s-20 flex items-center'}>
      <div
        className={
          'flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-6 bg-white/25'
        }
      >
        {icon}
      </div>
      <div className={'flex-shrink space-y-6'}>
        <div className={'text-14 font-weight-500'}>{title}</div>
        <div className={'h-32 text-12 text-white/60'}>{description}</div>
      </div>
    </div>
  );
};

export const CreateStrategyTypeMenu: FC<UseStrategyCreateReturn> = ({
  base,
  quote,
  strategyType,
  selectedStrategySettings,
  setSelectedStrategySettings,
}) => {
  const { t } = useTranslation();
  const {
    items: tabs,
    handleClick,
    selectedTabItems,
  } = useCreateStrategyTypeMenu(base?.address!, quote?.address!, strategyType);

  return (
    <>
      <m.div
        variants={items}
        className={'space-y-20 rounded-10 bg-silver p-20'}
        key={'createStrategyTypeMenu'}
      >
        <h2>{t('pages.strategyCreate.step1.section2.title')}</h2>
        <TabsMenu>
          {tabs.map(({ label, to, search }) => (
            <TabsMenuButton
              key={label}
              onClick={() => {
                setSelectedStrategySettings(undefined);
                handleClick(to, search, true);
              }}
              isActive={search.strategyType === strategyType}
            >
              {label}
            </TabsMenuButton>
          ))}
        </TabsMenu>

        <div>
          {strategyType === 'recurring' &&
            BlockIconTextDesc({
              icon: <IconArrows className={'h-18 w-18'} />,
              title: t(
                'pages.strategyCreate.step1.section2.strategyTypes.type1.contents.content1'
              ),
              description: t(
                'pages.strategyCreate.step1.section2.strategyTypes.type1.contents.content2'
              ),
            })}
          {strategyType === 'disposable' &&
            BlockIconTextDesc({
              icon: <IconArrowsTransparent className={'h-18 w-18'} />,
              title: t(
                'pages.strategyCreate.step1.section2.strategyTypes.type2.contents.content1'
              ),
              description: t(
                'pages.strategyCreate.step1.section2.strategyTypes.type2.contents.content2'
              ),
            })}
        </div>

        <div className={'space-s-14 flex'}>
          {selectedTabItems.map(({ label, svg, to, search }, i) => (
            <Button
              key={i}
              variant={'black'}
              onClick={() => setSelectedStrategySettings({ to, search })}
              fullWidth
              className={`flex h-auto flex-col items-center justify-center rounded-10 px-0 py-10 ${
                selectedStrategySettings?.search.strategyDirection ===
                  search.strategyDirection &&
                selectedStrategySettings?.search.strategySettings ===
                  search.strategySettings
                  ? '!border-white/80'
                  : ''
              }`}
            >
              {svg}

              <span className={'mt-10 text-14'}>{label}</span>
            </Button>
          ))}
        </div>
      </m.div>
      <Button
        variant={'success'}
        fullWidth
        size={'lg'}
        disabled={!selectedStrategySettings}
        onClick={() => {
          handleClick(
            selectedStrategySettings?.to!,
            selectedStrategySettings?.search!
          );
          carbonEvents.strategy.newStrategyNextStepClick({
            baseToken: base,
            quoteToken: quote,
            strategySettings: selectedStrategySettings?.search.strategySettings,
            strategyDirection:
              selectedStrategySettings?.search.strategyDirection,
            strategyType: strategyType,
          });
        }}
      >
        {t('pages.strategyCreate.step1.actionButton')}
      </Button>
    </>
  );
};
