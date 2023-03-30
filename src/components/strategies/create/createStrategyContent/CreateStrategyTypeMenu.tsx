import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { PathNames } from 'libs/routing';
import { FC, ReactNode, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-location';
import {
  StrategyCreateLocationGenerics,
  StrategyType,
} from 'components/strategies/create/CreateStrategyMain';
import { ReactComponent as IconBuyRange } from 'assets/icons/buy-range.svg';
import { ReactComponent as IconBuyLimit } from 'assets/icons/buy-limit.svg';
import { ReactComponent as IconSellRange } from 'assets/icons/sell-range.svg';
import { ReactComponent as IconSellLimit } from 'assets/icons/sell-limit.svg';
import { ReactComponent as IconTwoRanges } from 'assets/icons/two-ranges.svg';
import { ReactComponent as IconTwoLimits } from 'assets/icons/two-limits.svg';
import { ReactComponent as IconCustomStrategy } from 'assets/icons/custom-strategy.svg';
import { Button } from 'components/common/button';

type Props = {
  base: string;
  quote: string;
  strategyType?: StrategyType;
};

type StrategyTypeItem = {
  label: string;
  to: string;
  search: StrategyCreateLocationGenerics['Search'];
};

type StrategyTypeItemSvg = StrategyTypeItem & {
  svg: ReactNode;
};

function useCreateStrategyTypeMenu(
  base: string,
  quote: string,
  strategyType: 'reoccurring' | 'disposable' | undefined
) {
  const navigate = useNavigate();

  const items: StrategyTypeItem[] = [
    {
      label: 'Reoccurring',
      to: PathNames.createStrategy,
      search: {
        base,
        quote,
        strategyType: 'reoccurring',
      },
    },
    {
      label: 'Disposable',
      to: PathNames.createStrategy,
      search: {
        base,
        quote,
        strategyType: 'disposable',
      },
    },
  ];

  const items2: StrategyTypeItemSvg[] = [
    {
      label: '2 Limits',
      svg: <IconTwoRanges className={'w-60'} />,
      to: PathNames.createStrategy,
      search: {
        base,
        quote,
        strategyType: 'reoccurring',
        strategySettings: 'range',
      },
    },
    {
      label: '2 Ranges',
      svg: <IconTwoLimits className={'w-60'} />,
      to: PathNames.createStrategy,
      search: {
        base,
        quote,
        strategyType: 'reoccurring',
        strategySettings: 'limit',
      },
    },
    {
      label: 'Custom',
      svg: <IconCustomStrategy className={'w-60'} />,
      to: PathNames.createStrategy,
      search: {
        base,
        quote,
        strategyType: 'reoccurring',
        strategySettings: 'custom',
      },
    },
  ];

  const items3: StrategyTypeItemSvg[] = [
    {
      label: 'Buy Limit',
      svg: <IconBuyLimit className={'w-60 text-green'} />,
      to: PathNames.createStrategy,
      search: {
        base,
        quote,
        strategyType: 'disposable',
        strategyDirection: 'buy',
        strategySettings: 'limit',
      },
    },
    {
      label: 'Buy Range',
      svg: <IconBuyRange className={'w-60 text-green'} />,
      to: PathNames.createStrategy,
      search: {
        base,
        quote,
        strategyType: 'disposable',
        strategyDirection: 'buy',
        strategySettings: 'range',
      },
    },
    {
      label: 'Sell Limit',
      svg: <IconSellLimit className={'w-60 text-red'} />,
      to: PathNames.createStrategy,
      search: {
        base,
        quote,
        strategyType: 'disposable',
        strategyDirection: 'sell',
        strategySettings: 'limit',
      },
    },
    {
      label: 'Sell Range',
      svg: <IconSellRange className={'w-60 text-red'} />,
      to: PathNames.createStrategy,
      search: {
        base,
        quote,
        strategyType: 'disposable',
        strategyDirection: 'sell',
        strategySettings: 'range',
      },
    },
  ];

  const handleClick = (to: string, search: any) => {
    navigate({ to, search });
  };

  const selectedTabItems = useMemo(() => {
    switch (strategyType) {
      case 'reoccurring':
        return items2;
      case 'disposable':
        return items3;
      default:
        return [];
    }
  }, [items2, items3, strategyType]);
  return { items, handleClick, selectedTabItems };
}

export const CreateStrategyTypeMenu: FC<Props> = ({
  base,
  quote,
  strategyType,
}) => {
  const { items, handleClick, selectedTabItems } = useCreateStrategyTypeMenu(
    base,
    quote,
    strategyType
  );

  return (
    <div className={'space-y-20 rounded-10 bg-silver p-20'}>
      <h2>Strategy Type</h2>
      <TabsMenu>
        {items.map(({ label, to, search }) => (
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
    </div>
  );
};
