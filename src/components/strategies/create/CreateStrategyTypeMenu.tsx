import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { FC, ReactNode } from 'react';
import { Button } from 'components/common/button';
import { items } from 'components/strategies/create/variants';
import { m } from 'libs/motion';
import { UseStrategyCreateReturn } from 'components/strategies/create/index';
import { useCreateStrategyTypeMenu } from 'components/strategies/create/useCreateStrategyTypeMenu';
import { ReactComponent as IconArrows } from 'assets/icons/arrows.svg';
import { ReactComponent as IconArrowsTransparent } from 'assets/icons/arrows-transparent.svg';

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
    <div className={'flex items-center space-x-20'}>
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
          {strategyType === 'reoccurring' &&
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

        <div className={'flex space-x-14'}>
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
                  ? '!border-grey3'
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
        onClick={() =>
          handleClick(
            selectedStrategySettings?.to!,
            selectedStrategySettings?.search!
          )
        }
      >
        Next Step
      </Button>
    </>
  );
};
