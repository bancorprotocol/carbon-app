import { Token } from 'libs/tokens';
import { TokenLogo } from 'components/common/imager/Imager';

export const TokensOverlap = ({
  tokens,
  size,
  maxLogos = 4,
}: {
  tokens: (Token | undefined)[];
  maxLogos?: number;
  className?: string;
  size: number;
}) => {
  const tokenCount = tokens.length;
  return (
    <span className="isolate flex shrink-0 items-center">
      {tokens.slice(0, maxLogos).map((token, index, list) => (
        <TokenLogo
          size={size}
          token={token}
          key={index + (token?.symbol || '')}
          className="max-w-none border border-black bg-main-900"
          style={{
            zIndex: list.length - index,
            marginLeft: index > 0 ? `-${size * 0.3}px` : '0px',
          }}
        />
      ))}
      {tokenCount > maxLogos && (
        <span
          className="size-30 text-12 flex items-center justify-center rounded-full bg-main-900"
          style={{
            marginLeft: `-${size * 0.3}px`,
          }}
        >
          +{tokenCount - maxLogos}
        </span>
      )}
    </span>
  );
};
