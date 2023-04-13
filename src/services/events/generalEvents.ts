import { sendGTMEvent } from './googleTagManager';
import { CarbonEvents, EventCategory } from './googleTagManager/types';

export interface EventGeneralSchema extends EventCategory {
  changePage: {
    input: { referrer: string | null };
    gtmData: {
      page_referrer_spa: string | null;
    };
  };
}

export const generalEvents: CarbonEvents['general'] = {
  changePage: ({ referrer }) => {
    sendGTMEvent('general', 'changePage', {
      page_referrer_spa: referrer ? referrer : null,
    });
  },
};
