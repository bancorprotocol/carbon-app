import { DebugImposter } from 'elements/debug/DebugImposter';
import { DebugTenderlyRPC } from 'elements/debug/DebugTenderlyRPC';
import { DebugWeb3 } from 'elements/debug/DebugWeb3';
import { Page } from 'components/Page';
import { DebugTenderlyFaucet } from 'elements/debug/DebugTenderlyFaucet';

export const DebugPage = () => {
  return (
    <Page title={'Debug'}>
      <DebugWeb3 />
      <DebugTenderlyRPC />
      <DebugImposter />
      <DebugTenderlyFaucet />
    </Page>
  );
};
