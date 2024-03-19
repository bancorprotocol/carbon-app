import { ExplorerEmpty } from 'components/explorer/ExplorerEmpty';
import { FC } from 'react';

interface Props {
  type: 'strategies' | 'activities';
}
export const ExplorerEmptyError: FC<Props> = ({ type = 'strategies' }) => {
  return (
    <ExplorerEmpty
      variant="error"
      title={`We couldn't find any ${type}`}
      text="Try entering a different wallet address or choose a different token pair or reset your filters."
    />
  );
};
