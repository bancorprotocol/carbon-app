import { ReactNode, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-location';
import { PathNames } from 'libs/routing';
import { i18n } from 'libs/translations';
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
  isRecommended?: boolean;
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
      label: i18n.t(
        'pages.strategyCreate.step1.section2.strategyTypes.type1.title'
      ),
      to: PathNames.createStrategy,
      search: {
        base,
        quote,
        strategyType: 'recurring',
      },
    },
    {
      label: i18n.t(
        'pages.strategyCreate.step1.section2.strategyTypes.type2.title'
      ),
      to: PathNames.createStrategy,
      search: {
        base,
        quote,
        strategyType: 'disposable',
      },
    },
  ];

  const typeRecurring: StrategyTypeItemSvg[] = useMemo(
    () => [
      {
        label: i18n.t(
          'pages.strategyCreate.step1.section2.strategyTypes.type1.options.option1'
        ),
        svg: <IconTwoLimits className={'w-60'} />,
        to: PathNames.createStrategy,
        search: {
          base,
          quote,
          strategyType: 'recurring',
          strategySettings: 'limit',
        },
        isRecommended: true,
      },
      {
        label: i18n.t(
          'pages.strategyCreate.step1.section2.strategyTypes.type1.options.option2'
        ),
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
        label: i18n.t(
          'pages.strategyCreate.step1.section2.strategyTypes.type1.options.option3'
        ),
        svg: <IconCustomStrategy className={'w-60'} />,
        to: PathNames.createStrategy,
        search: {
          base,
          quote,
          strategyType: 'recurring',
          strategySettings: 'custom',
        },
      },
    ],
    [base, quote]
  );

  const typeDisposable: StrategyTypeItemSvg[] = useMemo(
    () => [
      {
        label: i18n.t(
          'pages.strategyCreate.step1.section2.strategyTypes.type2.options.option1'
        ),
        svg: <IconBuyLimit className={'w-60 text-green'} />,
        to: PathNames.createStrategy,
        search: {
          base,
          quote,
          strategyType: 'disposable',
          strategyDirection: 'buy',
          strategySettings: 'limit',
        },
        isRecommended: true,
      },
      {
        label: i18n.t(
          'pages.strategyCreate.step1.section2.strategyTypes.type2.options.option2'
        ),
        svg: <IconBuyRange className={'w-60 text-green'} />,
        to: PathNames.createStrategy,
        search: {
          base,
          quote,
          strategyType: 'disposable',
          strategyDirection: 'buy',
          strategySettings: 'range',
        },
        isRecommended: true,
      },
      {
        label: i18n.t(
          'pages.strategyCreate.step1.section2.strategyTypes.type2.options.option3'
        ),
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
        label: i18n.t(
          'pages.strategyCreate.step1.section2.strategyTypes.type2.options.option4'
        ),
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
    ],
    [base, quote]
  );

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
