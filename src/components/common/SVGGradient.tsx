export const SVGGradient = () => {
  return (
    <svg width="0" height="0">
      <defs>
        <linearGradient id="svg-brand-gradient">
          <stop offset="0%" stopColor="var(--color-primary)" />
          <stop offset="50%" stopColor="var(--color-secondary)" />
          <stop offset="100%" stopColor="var(--color-tertiary)" />
        </linearGradient>
        <linearGradient id="svg-buy-gradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--color-buy)" />
          <stop offset="100%" stopColor="var(--color-buy-dark)" />
        </linearGradient>
        <linearGradient id="svg-sell-gradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--color-sell)" />
          <stop offset="100%" stopColor="var(--color-sell-dark)" />
        </linearGradient>
      </defs>
    </svg>
  );
};
