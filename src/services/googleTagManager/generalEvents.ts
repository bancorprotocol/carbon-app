import { sendEvent } from '.';
import { CarbonEvents } from './types';

export const generalEvents: CarbonEvents['general'] = {
  changePage: ({ referrer }) => {
    sendEvent('general', 'changePage', {
      page_referrer_spa: referrer ? referrer : null,
    });
  },
};
