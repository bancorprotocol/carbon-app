import { MakeGenerics, PathNames, useNavigate, useSearch } from 'libs/routing';
import { Strategy } from 'libs/queries';

type MyLocationGenerics = MakeGenerics<{
  Search: {
    strategy: string;
  };
}>;

const isValid = (strategy: Strategy) => {
  return (
    strategy.hasOwnProperty('token0') &&
    strategy.hasOwnProperty('token1') &&
    strategy.hasOwnProperty('order0') &&
    strategy.hasOwnProperty('order1')
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
  const navigate = useNavigate<MyLocationGenerics>();
  const duplicate = (strategy: Strategy) => {
    const encodedStrategy = Buffer.from(JSON.stringify(strategy)).toString(
      'base64'
    );

    navigate({
      to: `${PathNames.createStrategy}/?strategy=${encodedStrategy}`,
    });
  };

  const { strategy: urlStrategy } = useSearch<MyLocationGenerics>();

  return {
    duplicate,
    templateStrategy: decodeStrategyAndValidate(urlStrategy),
  };
};
