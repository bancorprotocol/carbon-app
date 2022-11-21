import { DebugImposter } from 'elements/debug/DebugImposter';
import { DebugTenderlyRPC } from 'elements/debug/DebugTenderlyRPC';
import { DebugWeb3 } from 'elements/debug/DebugWeb3';
import { Page } from 'components/Page';
import { DebugModal } from 'elements/debug/DebugModal';
import { DropdownMenu } from 'components/DropdownMenu';
import { ChartComponent } from 'components/Chart';

export const DebugPage = () => {
  return (
    <Page title={'Debug'}>
      <ChartComponent />

      <DebugWeb3 />
      <DebugTenderlyRPC />
      <DebugImposter />
      <DebugModal />
      <DropdownMenu button={'Menu'}>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
      </DropdownMenu>
    </Page>
  );
};
