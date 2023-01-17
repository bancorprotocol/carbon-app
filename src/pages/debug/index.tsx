import { DebugImposter } from 'components/debug/DebugImposter';
import { DebugTenderlyRPC } from 'components/debug/DebugTenderlyRPC';
import { DebugWeb3 } from 'components/debug/DebugWeb3';
import { Page } from 'components/common/page';
import { DebugTenderlyFaucet } from 'components/debug/DebugTenderlyFaucet';
import { DebugTransferNFT } from 'components/debug/DebugTransferNFT';
import { DebugResetDefault } from 'components/debug/DebugResetDefault';
import { DebugNotifications } from 'components/debug/DebugNotifications';

export const DebugPage = () => {
  return (
    <Page title={'Debug'}>
      <div className="grid grid-cols-2 gap-20">
        <DebugResetDefault />
        <DebugWeb3 />
        <DebugImposter />
        <DebugTenderlyRPC />
        <DebugTenderlyFaucet />
        <DebugTransferNFT />
        <DebugNotifications />
      </div>
    </Page>
  );
};
