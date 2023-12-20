import { PathNames, useNavigate, useSearch } from 'libs/routing';
import { Strategy } from 'libs/queries';
import { isOverlappingStrategy } from '../overlapping/utils';

interface MyLocationSearch {
  strategy: string;
}

const isValid = (strategy: Strategy) => {
  return (
    (strategy.hasOwnProperty('base') && strategy.hasOwnProperty('quote')) ||
    (strategy.hasOwnProperty('order0') && strategy.hasOwnProperty('order1'))
  );
};

const decodeStrategyAndValidate = (
  urlStrategy?: string
): Strategy | undefined => {
  if (!urlStrategy) return;

  try {
    const decodedStrategy = JSON.parse(
      Buffer.from(urlStrategy, 'base64').toString('utf8')
    );

    if (isValid(decodedStrategy)) {
      return decodedStrategy;
    }
    return undefined;
  } catch (error) {
    console.log('Invalid value for search param `strategy`', error);
  }
};

export const useDuplicateStrategy = () => {
  const navigate = useNavigate();
  const search: MyLocationSearch = useSearch({ strict: false });
  const { strategy: urlStrategy } = search;

  const duplicate = (strategy: Partial<Strategy>) => {
    const encodedStrategy = Buffer.from(JSON.stringify(strategy)).toString(
      'base64'
    );

    navigate({
      to: `${PathNames.createStrategy}`,
      search: {
        ...search,
        strategy: encodedStrategy,
      },
    });
  };

  const decoded = decodeStrategyAndValidate(urlStrategy);
  // marginal price should be calculated based on prices
  if (decoded?.order0.marginalRate) decoded.order0.marginalRate = '';
  if (decoded?.order1.marginalRate) decoded.order1.marginalRate = '';
  // Remove balance if overlapping strategy because market price changed
  if (decoded && isOverlappingStrategy(decoded)) {
    decoded.order0.balance = '';
    decoded.order1.balance = '';
  }

  return {
    duplicate,
    templateStrategy: decoded,
  };
};
