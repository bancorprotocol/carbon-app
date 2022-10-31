import { DebugImposter } from 'elements/debug/DebugImposter';
import { DebugTenderlyRPC } from 'elements/debug/DebugTenderlyRPC';
import { DebugWeb3 } from 'elements/debug/DebugWeb3';
import { Page } from 'components/Page';
import { DebugModal } from 'elements/debug/DebugModal';
import { Switch } from 'components/Switch';
import { useState } from 'react';
import { Button } from 'components/Button';

export const DebugPage = () => {
  const [isOn, setIsOn] = useState(false);

  return (
    <Page title={'Debug'}>
      <Switch variant={'secondary'} size={'sm'} isOn={isOn} setIsOn={setIsOn} />
      <Button>Primary Button</Button>
      <Button variant={'success'} size={'sm'}>
        Success Button SMALL
      </Button>

      <DebugWeb3 />
      <DebugTenderlyRPC />
      <DebugImposter />
      <DebugModal />
    </Page>
  );
};
