import { NotFound } from 'components/common/NotFound';

export const NoStrategies = () => {
  return (
    <NotFound
      variant="error"
      title="We couldn't find any strategies"
      text="Try selecting a different token pair or reset your filters."
      bordered
    />
  );
};
