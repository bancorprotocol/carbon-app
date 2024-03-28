import { NotFound } from 'components/common/NotFound';

export const ExplorerTypePage = () => {
  return (
    <NotFound
      variant="info"
      title="Explore Strategies"
      text="You can explore strategy overviews and trading history by token pair or wallet address. Additionally, you have the option to duplicate strategies."
      bordered
    />
  );
};
