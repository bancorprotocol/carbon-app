import { CSSProperties } from 'react';

export const Loading = (style: CSSProperties) => (
  <div className="animate-pulse p-4" style={style}>
    <div className="bg-white/30 h-full rounded-2xl"></div>
  </div>
);
