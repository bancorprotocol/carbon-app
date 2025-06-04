import { FormEvent, useState } from 'react';
import { lsService } from 'services/localeStorage';
import { ReactComponent as IconGear } from 'assets/icons/gear.svg';

export interface NotificationPreference {
  global?: boolean;
}

export const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState(
    lsService.getItem('notificationPreferences'),
  );

  const onChange = (e: FormEvent<HTMLFormElement>) => {
    const data = new FormData(e.currentTarget);
    const changes: NotificationPreference = {};
    for (const [key, value] of data.entries()) {
      changes[key as keyof NotificationPreference] = !!(value === 'true');
    }
    setPreferences(changes);
    lsService.setItem('notificationPreferences', changes);
  };

  return (
    <form onChange={onChange} className="mt-24">
      <div className="rounded-6 flex border-2 border-white/10 px-16 py-8">
        <h3
          id="global-notif-label"
          className="text-16 flex flex-1 items-center gap-8"
        >
          <IconGear className="size-18" />
          Receive general notifications
        </h3>
        <div
          role="radiogroup"
          aria-labelledby="global-notif-label"
          className="text-14 font-weight-500 flex items-center rounded-full bg-black p-4 text-white/60"
        >
          <div className="relative">
            <input
              id="global-notif-on"
              type="radio"
              name="global"
              value="true"
              className="peer/notif-on absolute inset-0 opacity-0"
              defaultChecked={preferences?.global !== false}
            />
            <label
              htmlFor="global-notif-on"
              className="cursor-pointer rounded-full px-10 py-4 outline-1 peer-checked/notif-on:bg-white/10 peer-checked/notif-on:text-white peer-focus-visible/notif-on:outline"
            >
              On
            </label>
          </div>
          <div className="relative">
            <input
              id="global-notif-off"
              type="radio"
              name="global"
              value="false"
              className="peer/notif-off absolute inset-0 opacity-0"
              defaultChecked={preferences?.global === false}
            />
            <label
              htmlFor="global-notif-off"
              className="cursor-pointer rounded-full px-10 py-4 outline-1 peer-checked/notif-off:bg-white/10 peer-checked/notif-off:text-white peer-focus-visible/notif-off:outline"
            >
              Off
            </label>
          </div>
        </div>
      </div>
    </form>
  );
};
