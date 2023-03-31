import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { FC } from 'react';
import { Button } from 'components/common/button';
import { items } from './../variants';
import { m } from 'libs/motion';
import { UseStrategyCreateReturn } from 'components/strategies/create';
import { useCreateStrategyTypeMenu } from 'components/strategies/create/useCreateStrategyTypeMenu';

export const CreateStrategyTypeMenu: FC<UseStrategyCreateReturn> = ({
  base,
  quote,
  strategyType,
}) => {
  const {
    items: tabs,
    handleClick,
    selectedTabItems,
  } = useCreateStrategyTypeMenu(base?.address!, quote?.address!, strategyType);

  return (
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
            onClick={() => handleClick(to, search)}
            isActive={search.strategyType === strategyType}
          >
            {label}
          </TabsMenuButton>
        ))}
      </TabsMenu>

      <div>
        {strategyType === 'reoccurring' && <div>reoccuring</div>}
        {strategyType === 'disposable' && <div>disposable</div>}
      </div>

      <div className={'flex space-x-14'}>
        {selectedTabItems.map(({ label, svg, to, search }, i) => (
          <Button
            key={i}
            variant={'black'}
            onClick={() => handleClick(to, search)}
            fullWidth
            className={
              'flex h-auto flex-col items-center justify-center rounded-10 px-0 py-10'
            }
          >
            {svg}

            <span className={'mt-10 text-14'}>{label}</span>
          </Button>
        ))}
      </div>
    </m.div>
  );
};
