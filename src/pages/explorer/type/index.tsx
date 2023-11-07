import { ExplorerEmpty } from 'components/explorer';

export const ExplorerTypePage = () => {
  return (
    <ExplorerEmpty
      variant={'info'}
      title={'Explore Strategies'}
      text={
        'You can search for existing strategies by wallet address or a token pair. Please note that you can only view the strategies and cannot take any actions.'
      }
    />
  );
};
