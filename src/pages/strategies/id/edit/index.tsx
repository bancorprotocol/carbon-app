import { useMatch } from '@tanstack/react-location';
import { EditStrategyMain } from 'components/strategies/edit';
import { useMemo } from 'react';
import { useGetUserStrategies } from 'libs/queries';

export const EditNewStrategyPage = () => {
  const { data, isLoading } = useGetUserStrategies();
  const { params } = useMatch();

  const strategyToEdit = useMemo(() => {
    return data?.find((s) => s.id === params.id);
  }, [data, params.id]);

  return (
    <>
      {isLoading ? (
        <div>loading</div>
      ) : (
        <EditStrategyMain strategy={strategyToEdit} />
      )}
    </>
  );
};
