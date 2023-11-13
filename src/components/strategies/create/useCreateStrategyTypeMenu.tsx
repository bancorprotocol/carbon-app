import { ReactNode, useMemo } from 'react';
import { PathNames, useNavigate } from 'libs/routing';
import {
  StrategyCreateSearch,
  StrategyType,
} from 'components/strategies/create/types';
import { ReactComponent as IconBuyRange } from 'assets/icons/buy-range.svg';
import { ReactComponent as IconBuyLimit } from 'assets/icons/buy-limit.svg';
import { ReactComponent as IconSellRange } from 'assets/icons/sell-range.svg';
import { ReactComponent as IconSellLimit } from 'assets/icons/sell-limit.svg';
import { ReactComponent as IconTwoRanges } from 'assets/icons/two-ranges.svg';
import { ReactComponent as IconTwoLimits } from 'assets/icons/two-limits.svg';
import { ReactComponent as IconSymmetricStrategy } from 'assets/icons/symmetric-strategy.svg';

type StrategyTypeItem = {
  label: string;
  to: string;
  search: StrategyCreateSearch;
  isRecommended?: boolean;
  testid: string;
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
      testid: 'recurring',
    },
    {
      label: 'Disposable',
      to: PathNames.createStrategy,
      search: {
        base,
        quote,
        strategyType: 'disposable',
      },
      testid: 'disposable',
    },
  ];

  const typeRecurring: StrategyTypeItemSvg[] = useMemo(
    () => [
      {
        label: '2 Limits',
        svg: <IconTwoLimits className="w-60" />,
        to: PathNames.createStrategy,
        search: {
          base,
          quote,
          strategyType: 'recurring',
          strategySettings: 'limit',
        },
        isRecommended: true,
        testid: 'two-limits',
      },
      {
        label: '2 Ranges',
        svg: <IconTwoRanges className="w-60" />,
        to: PathNames.createStrategy,
        search: {
          base,
          quote,
          strategyType: 'recurring',
          strategySettings: 'range',
        },
        isRecommended: true,
        testid: 'two-ranges',
      },
      {
        label: 'Symmetric',
        svg: <IconSymmetricStrategy className="w-60" />,
        to: PathNames.createStrategy,
        search: {
          base,
          quote,
          strategyType: 'recurring',
          strategySettings: 'symmetric',
        },
        testid: 'symmetric',
      },
    ],
    [base, quote]
  );

  const typeDisposable: StrategyTypeItemSvg[] = useMemo(
    () => [
      {
        label: 'Buy Limit',
        svg: <IconBuyLimit className="w-60 text-green" />,
        to: PathNames.createStrategy,
        search: {
          base,
          quote,
          strategyType: 'disposable',
          strategyDirection: 'buy',
          strategySettings: 'limit',
        },
        isRecommended: true,
        testid: 'buy-limit',
      },
      {
        label: 'Sell Limit',
        svg: <IconSellLimit className="w-60 text-red" />,
        to: PathNames.createStrategy,
        search: {
          base,
          quote,
          strategyType: 'disposable',
          strategyDirection: 'sell',
          strategySettings: 'limit',
        },
        isRecommended: true,
        testid: 'sell-limit',
      },
      {
        label: 'Buy Range',
        svg: <IconBuyRange className="w-60 text-green" />,
        to: PathNames.createStrategy,
        search: {
          base,
          quote,
          strategyType: 'disposable',
          strategyDirection: 'buy',
          strategySettings: 'range',
        },
        testid: 'buy-range',
      },
      {
        label: 'Sell Range',
        svg: <IconSellRange className="w-60 text-red" />,
        to: PathNames.createStrategy,
        search: {
          base,
          quote,
          strategyType: 'disposable',
          strategyDirection: 'sell',
          strategySettings: 'range',
        },
        testid: 'sell-range',
      },
    ],
    [base, quote]
  );

  const handleClick = (
    to: string,
    search: StrategyCreateSearch,
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
