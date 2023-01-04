import { ModalFC } from 'libs/modals/modals.types';
import { ModalSlideOver } from 'libs/modals/ModalSlideOver';

export const ModalNotifications: ModalFC<undefined> = ({ id }) => {
  return (
    <ModalSlideOver id={id} title={'Notifications'} size={'md'}>
      <div className={'mt-30'}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium,
          aliquam animi asperiores beatae commodi doloremque earum
          exercitationem fuga in iste laboriosam officia, placeat praesentium
          temporibus voluptate! Amet dolorum molestiae vero?
        </p>
      </div>
    </ModalSlideOver>
  );
};
