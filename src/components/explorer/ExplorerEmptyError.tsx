import { ExplorerEmpty } from 'components/explorer/ExplorerEmpty';

export const ExplorerEmptyError = () => {
  return (
    <ExplorerEmpty
      variant={'error'}
      title={"We couldn't find any strategies"}
      text={
        'Try entering a different wallet address or choose a different token pair or reset your filters.'
      }
    />
  );
};
