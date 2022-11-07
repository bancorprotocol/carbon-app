import { DebugImposter } from 'elements/debug/DebugImposter';
import { DebugTenderlyRPC } from 'elements/debug/DebugTenderlyRPC';
import { DebugWeb3 } from 'elements/debug/DebugWeb3';
import { Page } from 'components/Page';
import { DebugModal } from 'elements/debug/DebugModal';
import { Switch } from 'components/Switch';
import { useState } from 'react';
import { Button } from 'components/Button';
import { DropdownMenu } from 'components/DropdownMenu';

export const DebugPage = () => {
  const [isOn, setIsOn] = useState(false);

  return (
    <Page title={'Debug'}>
      <Switch isOn={isOn} setIsOn={setIsOn} />
      <Switch variant={'secondary'} size={'sm'} isOn={isOn} setIsOn={setIsOn} />
      <Switch variant={'secondary'} size={'lg'} isOn={isOn} setIsOn={setIsOn} />

      <Button variant={'secondary'}>Secondary Button</Button>
      <Button variant={'tertiary'} size={'sm'}>
        Tertiary Button SMALL
      </Button>
      <Button>Primary Button</Button>
      <Button variant={'success'} size={'sm'}>
        Success Button SMALL
      </Button>
      <Button>Primary Button</Button>
      <Button variant={'success'} size={'sm'}>
        Success Button SMALL
      </Button>
      <Button>Primary Button</Button>
      <Button variant={'success'} size={'sm'}>
        Success Button SMALL
      </Button>

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
