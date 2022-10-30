import { useQuery } from '@tanstack/react-query';
import { tokenList } from 'services/tokens';

export const TradePage = () => {
  const query = useQuery(['tokens'], tokenList);

  return (
    <div>
      <span>Here be trades!'</span>
    </div>
  );
};
