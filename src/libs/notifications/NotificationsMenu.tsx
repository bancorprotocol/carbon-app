import { Button } from 'components/common/button';
import { m } from 'libs/motion';
import { NotificationLine } from './NotificationLine';
import { useNotifications } from './NotificationsProvider';
import { ReactComponent as IconBell } from 'assets/icons/bell.svg';
import { useRef, useState } from 'react';
import { useOutsideClick } from 'hooks/useOutsideClick';

export const NotificationsMenu = () => {
  const { notifications, createStrategyNtfc } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false));

  return (
    <m.div ref={ref} initial={false} animate={open ? 'open' : 'closed'}>
      <button
        onClick={() => setOpen(!open)}
        className="rounded-full bg-emphasis p-12"
      >
        <IconBell />
      </button>
      {open && (
        <div className="bg-body min-w-[500px]">
          {notifications.map((notification) => (
            <NotificationLine
              key={notification.id}
              notification={notification}
            />
          ))}
          <Button onClick={() => createStrategyNtfc('')}>New</Button>
        </div>
      )}
    </m.div>
  );
};
