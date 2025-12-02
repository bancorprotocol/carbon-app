import { useState } from 'react';
import { lsService } from 'services/localeStorage';
import IconGear from 'assets/icons/gear.svg?react';
import { Radio, RadioGroup } from 'components/common/radio/RadioGroup';

export interface NotificationPreference {
  global?: boolean;
}

export const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState(
    lsService.getItem('notificationPreferences'),
  );

  const setGlobal = (isGlobal: boolean) => {
    setPreferences({ global: isGlobal });
    lsService.setItem('notificationPreferences', { global: isGlobal });
  };

  return (
    <form className="rounded-sm flex items-center gap-8 border border-white/10 px-16 py-8 bg-main-600/40">
      <h3
        id="global-notif-label"
        className="text-16 flex flex-1 items-center gap-8 font-normal"
      >
        <IconGear className="size-18 shrink-0 hidden md:block" />
        Receive general notifications
      </h3>
      <RadioGroup className="shrink-0 p-2" aria-labelledby="global-notif-label">
        <Radio
          checked={preferences?.global !== false}
          onChange={() => setGlobal(true)}
        >
          On
        </Radio>
        <Radio
          checked={preferences?.global === false}
          onChange={() => setGlobal(false)}
        >
          Off
        </Radio>
      </RadioGroup>
    </form>
  );
};
