import { DebugImposter } from 'elements/debug/DebugImposter';
import { DebugTenderlyRPC } from 'elements/debug/DebugTenderlyRPC';
import { DebugWeb3 } from 'elements/debug/DebugWeb3';
import { Page } from 'components/Page';
import { GetUserApprovalProps } from 'queries/chain/approval';

export type ApprovalToken = GetUserApprovalProps & {
  amount: string;
  symbol: string;
};

export const DebugPage = () => {
  return (
    <Page title={'Debug'}>
      <DebugWeb3 />
      <DebugTenderlyRPC />
      <DebugImposter />
    </Page>
  );
};
