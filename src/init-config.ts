import config from 'config';

if (!config.ui.useGradientBranding) {
  document.documentElement.style.setProperty(
    '--gradient-first',
    'var(--primary)',
  );
  document.documentElement.style.setProperty(
    '--gradient-middle',
    'var(--primary)',
  );
  document.documentElement.style.setProperty(
    '--gradient-last',
    'var(--primary)',
  );
}

export {};
