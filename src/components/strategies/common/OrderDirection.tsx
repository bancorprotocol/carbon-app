import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { StrategyDirection } from 'libs/routing';
import { FC } from 'react';

interface Props {
  direction: StrategyDirection;
  setDirection: (direction: StrategyDirection) => any;
}
export const OrderDirection: FC<Props> = (props) => {
  const { direction, setDirection } = props;
  return (
    <TabsMenu className="bg-background-900 px-16">
      <TabsMenuButton
        onClick={() => setDirection('sell')}
        variant={direction === 'buy' ? 'black' : 'sell'}
        data-testid="tab-sell"
      >
        Sell
      </TabsMenuButton>
      <TabsMenuButton
        onClick={() => setDirection('buy')}
        variant={direction !== 'buy' ? 'black' : 'buy'}
        data-testid="tab-buy"
      >
        Buy
      </TabsMenuButton>
    </TabsMenu>
  );
};
