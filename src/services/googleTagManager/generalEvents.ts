import { sendEvent } from '.';
import { CarbonEvents, EventCategory } from './types';

export interface EventGeneralSchemaNew extends EventCategory {
  changePage: {
    input: { referrer: string | null };
    gtmData: {
      page_referrer_spa: string | null;
    };
  };
}

export const generalEvents: CarbonEvents['general'] = {
  changePage: ({ referrer }) => {
    sendEvent('general', 'changePage', {
      page_referrer_spa: referrer ? referrer : null,
    });
  },
};
