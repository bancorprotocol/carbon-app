import config from 'config';
export const externalLinks = {
  analytics: config.externalLinks?.analytics,
  simulatorRepo: config.externalLinks?.simulatorRepo,
  duneDashboard: config.externalLinks?.duneDashboard,
  terms: config.appUrl + '/terms',
  privacy: config.appUrl + '/privacy',
  carbonHomepage: 'https://carbondefi.xyz',
  blog: 'https://blog.carbondefi.xyz',
  faq: 'https://faq.carbondefi.xyz/',
  x: 'https://x.com/carbondefixyz',
  youtube: 'https://www.youtube.com/c/BancorProtocol',
  discord: 'https://discord.gg/bancor',
  telegram: 'https://t.me/CarbonDeFixyz',
  techDocs: 'https://docs.carbondefi.xyz/',
  litePaper: 'https://carbondefi.xyz/litepaper',
  whitepaper: 'https://carbondefi.xyz/whitepaper',
  roiLearnMore: 'https://faq.carbondefi.xyz/strategy-roi-and-apr',
  treasuryGov:
    'https://home.treasury.gov/policy-issues/financial-sanctions/recent-actions/20220808',
  whatIsOverlapping:
    'https://faq.carbondefi.xyz/what-is-an-overlapping-strategy#overlapping-budget-dynamics',
};
