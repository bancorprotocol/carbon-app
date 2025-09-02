import config from 'config';

if (!config.ui.useGradientBranding) {
  document.documentElement.style.setProperty(
    '--color-primary',
    'var(--color-primary)',
  );
  document.documentElement.style.setProperty(
    '--color-secondary',
    'var(--color-secondary)',
  );
  document.documentElement.style.setProperty(
    '--color-tertiary',
    'var(--color-primary)',
  );
}

export {};
