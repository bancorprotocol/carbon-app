import { MakeGenerics, PathNames, useNavigate, useSearch } from 'libs/routing';
import { Strategy } from 'libs/queries';

type MyLocationGenerics = MakeGenerics<{
  Search: {
    strategy: string;
  };
}>;

export const useDuplicateStrategy = () => {
  const navigate = useNavigate<MyLocationGenerics>();
  const { strategy: templateStrategy } = useSearch<MyLocationGenerics>();

  const isValid = (strategy: Strategy) => {
    return (
      strategy.hasOwnProperty('token0') &&
      strategy.hasOwnProperty('token1') &&
      strategy.hasOwnProperty('order0') &&
      strategy.hasOwnProperty('order1')
    );
  };

  const decodedStrategyAndValidate = () => {
    try {
      const decodedStrategy = JSON.parse(
        Buffer.from(templateStrategy || '', 'base64').toString('utf8')
      );

      const isStrategyValid = isValid(decodedStrategy);
      if (isStrategyValid) {
        return decodedStrategy;
      }
      return undefined;
    } catch (error) {}
  };

  const duplicate = (strategy: Strategy) => {
    const encodedStrategy = Buffer.from(JSON.stringify(strategy)).toString(
      'base64'
    );

    navigate({
      to: `${PathNames.createStrategy}/?strategy=${encodedStrategy}`,
    });
  };

  return {
    duplicate,
    templateStrategy: decodedStrategyAndValidate(),
  };
};
