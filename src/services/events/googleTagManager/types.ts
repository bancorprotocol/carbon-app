export type GTMData = {
  event?: string;
  event_properties?: any;
  user_properties?: { wallet_id?: string; wallet_name?: string };
  wallet?: { wallet_id?: string; wallet_name?: string };
  page?: {
    page_referrer_spa?: string;
  };
};

export type EventCategory = { [key: string]: { input: any; gtmData: any } };
export type CarbonEventsInput<T extends Record<string, any>> = {
  [key in keyof T]: (params: T[key]) => void;
};
