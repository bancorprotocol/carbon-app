import { Page } from 'components/Page';
import { CreateStrategy } from 'elements/strategies/create';

export const CreateStrategyPage = () => {
  return (
    <div className={'mx-auto max-w-[650px]'}>
      <Page title={'Create Strategy'}>
        <CreateStrategy />
      </Page>
    </div>
  );
};
