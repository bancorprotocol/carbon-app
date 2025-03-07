import { sendGTMEvent } from './googleTagManager';
import { CarbonEventsInput } from './googleTagManager/types';

export interface Props {
  changePage: {
    referrer: string | null;
  };
}

export const generalEvents: CarbonEventsInput<Props> = {
  changePage: ({ referrer }: { referrer: string | null }) => {
    sendGTMEvent('general', 'changePage', {
      page_referrer_spa: referrer ? referrer : null,
    });
  },
};
