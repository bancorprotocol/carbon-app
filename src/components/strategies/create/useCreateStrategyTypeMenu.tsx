import { useNavigate } from '@tanstack/react-location';
import { PathNames } from 'libs/routing';
import { ReactNode, useMemo } from 'react';
import {
  StrategyCreateLocationGenerics,
  StrategyType,
} from 'components/strategies/create/types';
import { ReactComponent as IconBuyRange } from 'assets/icons/buy-range.svg';
import { ReactComponent as IconBuyLimit } from 'assets/icons/buy-limit.svg';
import { ReactComponent as IconSellRange } from 'assets/icons/sell-range.svg';
import { ReactComponent as IconSellLimit } from 'assets/icons/sell-limit.svg';
import { ReactComponent as IconTwoRanges } from 'assets/icons/two-ranges.svg';
import { ReactComponent as IconTwoLimits } from 'assets/icons/two-limits.svg';
import { ReactComponent as IconCustomStrategy } from 'assets/icons/custom-strategy.svg';

type StrategyTypeItem = {
  label: string;
  to: string;
  search: StrategyCreateLocationGenerics['Search'];
};

type StrategyTypeItemSvg = StrategyTypeItem & {
  svg: ReactNode;
};

export const useCreateStrategyTypeMenu = (
  base: string,
  quote: string,
  strategyType?: StrategyType
) => {
  const navigate = useNavigate();

  const types: StrategyTypeItem[] = [
    {
      label: 'Recurring',
      to: PathNames.createStrategy,
      search: {
        base,
        quote,
        strategyType: 'recurring',
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

  const typeRecurring: StrategyTypeItemSvg[] = [
    {
      label: '2 Limits',
      svg: <IconTwoLimits className={'w-60'} />,
      to: PathNames.createStrategy,
      search: {
        base,
        quote,
        strategyType: 'recurring',
        strategySettings: 'limit',
      },
    },
    {
      label: '2 Ranges',
      svg: <IconTwoRanges className={'w-60'} />,
      to: PathNames.createStrategy,
      search: {
        base,
        quote,
        strategyType: 'recurring',
        strategySettings: 'range',
      },
    },
    {
      label: 'Custom',
      svg: <IconCustomStrategy className={'w-60'} />,
      to: PathNames.createStrategy,
      search: {
        base,
        quote,
        strategyType: 'recurring',
        strategySettings: 'custom',
      },
    },
  ];

  const typeDisposable: StrategyTypeItemSvg[] = [
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

  const handleClick = (
    to: string,
    search: StrategyCreateLocationGenerics['Search'],
    replace?: boolean
  ) => {
    navigate({ to, search, replace });
  };

  const selectedTabItems = useMemo(() => {
    switch (strategyType) {
      case 'recurring':
        return typeRecurring;
      case 'disposable':
        return typeDisposable;
      default:
        return [];
    }
  }, [typeRecurring, typeDisposable, strategyType]);

  return { items: types, handleClick, selectedTabItems };
};
