export const SVGGradient = () => {
  return (
    <svg width="0" height="0">
      <defs>
        <linearGradient id="svg-brand-gradient">
          <stop offset="0%" stopColor="var(--color-primary)" />
          <stop offset="100%" stopColor="var(--color-secondary)" />
        </linearGradient>
        <linearGradient id="svg-buy-gradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--color-buy)" />
          <stop offset="100%" stopColor="var(--color-buy-dark)" />
        </linearGradient>
        <linearGradient id="svg-sell-gradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--color-sell)" />
          <stop offset="100%" stopColor="var(--color-sell-dark)" />
        </linearGradient>
        <linearGradient id="svg-black-gradient" x1="0" x2="1" y1="0" y2="1">
          <stop
            offset="0%"
            stopColor="oklch(10% var(--chroma) var(--hue) / 0.5)"
          />
          <stop
            offset="100%"
            stopColor="oklch(10% var(--chroma) var(--hue) / 0.8)"
          />
        </linearGradient>
        <linearGradient id="svg-white-gradient" x1="0" x2="1" y1="0" y2="1">
          <stop
            offset="0%"
            stopColor="oklch(90% var(--chroma) var(--hue) / 0.1)"
          />
          <stop
            offset="100%"
            stopColor="oklch(90% var(--chroma) var(--hue) / 0.15)"
          />
        </linearGradient>
      </defs>
    </svg>
  );
};
