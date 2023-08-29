import { FC, ReactNode, useEffect } from 'react';
import { carbonEvents } from 'services/events';
import { m } from 'libs/motion';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { Button } from 'components/common/button';
import { items } from 'components/strategies/create/variants';
import { UseStrategyCreateReturn } from 'components/strategies/create/index';
import { useCreateStrategyTypeMenu } from 'components/strategies/create/useCreateStrategyTypeMenu';
import { ReactComponent as IconArrowsTransparent } from 'assets/icons/arrows-transparent.svg';
import { ReactComponent as IconArrows } from 'assets/icons/arrows.svg';
import { lsService } from 'services/localeStorage';
import { useModal } from 'hooks/useModal';

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
    <div className={'flex items-center space-s-20'}>
      <div
        className={
          'flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-6 bg-white/25'
        }
      >
        {icon}
      </div>
      <div className={'flex-shrink space-y-6'}>
        <div className={'text-14 font-weight-500'}>{title}</div>
        <div className={'min-h-[32px] text-12 text-white/60'}>
          {description}
        </div>
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
  const { openModal } = useModal();
  const {
    items: tabs,
    handleClick,
    selectedTabItems,
  } = useCreateStrategyTypeMenu(base?.address!, quote?.address!, strategyType);

  useEffect(() => {
    !selectedStrategySettings &&
      setSelectedStrategySettings(selectedTabItems[0]);
  }, [
    selectedTabItems,
    setSelectedStrategySettings,
    handleClick,
    selectedStrategySettings,
  ]);

  return (
    <>
      <m.div
        variants={items}
        className={'space-y-20 rounded-10 bg-silver p-20'}
        key={'createStrategyTypeMenu'}
      >
        <h2>Strategy Type</h2>
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
              title: 'Automated Linked Orders',
              description:
                'Tokens acquired in a buy order become automatically available to trade in the linked sell order, and vice versa.',
            })}
          {strategyType === 'disposable' &&
            BlockIconTextDesc({
              icon: <IconArrowsTransparent className={'h-18 w-18'} />,
              title: 'Single Use Order',
              description:
                'An irreversible buy or sell order at a predefined price or range.',
            })}
        </div>
        <div
          className={`${
            strategyType === 'disposable' ? 'grid grid-cols-2' : 'flex'
          } gap-12 pt-10 md:flex`}
        >
          {selectedTabItems.map(
            ({ label, svg, to, search, isRecommended }, i) => (
              <div key={`${label}-${i}`} className="relative flex flex-1">
                {isRecommended && (
                  <div className="absolute -top-16 left-1/2 z-10 -translate-x-1/2 rounded border-2 border-green/25 bg-darkGreen px-5 py-3 text-12 font-weight-500 text-green md:px-7 md:text-10">
                    Recommended
                  </div>
                )}
                <Button
                  variant={'black'}
                  onClick={() => {
                    if (
                      (search.strategySettings === 'range' ||
                        search.strategySettings === 'custom') &&
                      !lsService.getItem('hasSeenCreateStratExpertMode')
                    ) {
                      openModal('createStratExpertMode', {
                        onConfirm: () =>
                          setSelectedStrategySettings({ to, search }),
                      });
                    } else {
                      setSelectedStrategySettings({ to, search });
                    }
                  }}
                  fullWidth
                  className={`flex h-auto flex-col items-center justify-center rounded-10 px-0 py-10  ${
                    selectedStrategySettings?.search.strategyDirection ===
                      search.strategyDirection &&
                    selectedStrategySettings?.search.strategySettings ===
                      search.strategySettings
                      ? 'border-2 !border-white/80'
                      : ''
                  }`}
                >
                  {svg}
                  <span className={'mt-10 text-14'}>{label}</span>
                </Button>
              </div>
            )
          )}
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
        Next Step
      </Button>
    </>
  );
};
