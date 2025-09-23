import { useState } from 'react';
import { lsService } from 'services/localeStorage';
import { ReactComponent as IconGear } from 'assets/icons/gear.svg';
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
    <form className="mt-24">
      <div className="rounded-sm flex border-2 border-white/10 px-16 py-8">
        <h3
          id="global-notif-label"
          className="text-16 flex flex-1 items-center gap-8"
        >
          <IconGear className="size-18" />
          Receive general notifications
        </h3>
        <RadioGroup aria-labelledby="global-notif-label">
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
      </div>
    </form>
  );
};
