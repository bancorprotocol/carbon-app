import { DebugImposter } from 'components/debug/DebugImposter';
import { DebugTenderlyRPC } from 'components/debug/DebugTenderlyRPC';
import { DebugWeb3 } from 'components/debug/DebugWeb3';
import { Page } from 'components/common/page';
import { DebugTenderlyFaucet } from 'components/debug/DebugTenderlyFaucet';
import { DebugTransferNFT } from 'components/debug/DebugTransferNFT';
import { DebugResetDefault } from 'components/debug/DebugResetDefault';
import { DebugNotifications } from 'components/debug/DebugNotifications';
import { DebugCreateStrategy } from 'components/debug/DebugCreateStrategy';
import { DebugFiatCurrency } from 'components/debug/DebugFiatCurrency';
import { DebugOrderBook } from 'components/debug/DebugOrderBook';
import { Button } from 'components/common/button';
import { useModal } from 'hooks/useModal';

export const DebugPage = () => {
  const { openModal } = useModal();
  return (
    <Page title={'Debug'}>
      <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
        <DebugResetDefault />
        <DebugWeb3 />
        <DebugImposter />
        <DebugTenderlyRPC />
        <DebugTenderlyFaucet />
        <DebugTransferNFT />
        <DebugNotifications />
        <DebugCreateStrategy />
        <DebugFiatCurrency />
        <DebugOrderBook />

        <Button onClick={() => openModal('sheetTest', undefined)}>
          Open Sheet Modal
        </Button>
      </div>
    </Page>
  );
};
