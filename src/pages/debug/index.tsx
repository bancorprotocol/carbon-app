import { DebugImposter } from 'elements/debug/DebugImposter';
import { DebugTenderlyRPC } from 'elements/debug/DebugTenderlyRPC';
import { DebugWeb3 } from 'elements/debug/DebugWeb3';
import { Page } from 'components/page';
import { DebugTenderlyFaucet } from 'elements/debug/DebugTenderlyFaucet';
import { DebugTransferNFT } from 'elements/debug/DebugTransferNFT';
import { DebugResetDefault } from 'elements/debug/DebugResetDefault';

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
      </div>
    </Page>
  );
};
