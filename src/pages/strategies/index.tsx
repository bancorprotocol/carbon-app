import { Button } from 'components/Button';
import { Page } from 'components/Page';
import { useContract } from 'hooks/useContract';

export const StrategiesPage = () => {
  const { PoolCollection } = useContract();

  const getStrategies = async () => {
    try {
      const res = await PoolCollection.read.strategiesByIds([1]);
      console.log(res);

      const obj = {
        id: res[0].id.toString(),
        provider: res[0].provider,
        tokens: {
          source: res[0].tokens.source,
          target: res[0].tokens.target,
        },
        orders: [res[0].orders[0].toString(), res[0].orders[1].toString()],
      };
      console.log(obj);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Page title={'Strategies'}>
      <span>Here be strategies!'</span>

      <Button onClick={getStrategies}>get strategy</Button>
    </Page>
  );
};
