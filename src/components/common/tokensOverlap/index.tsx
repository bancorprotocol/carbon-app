import { Token } from 'libs/tokens';
import { Imager } from 'components/common/imager/Imager';

export const TokensOverlap = ({
  tokens,
  maxLogos = 4,
  className,
}: {
  tokens: Token[];
  maxLogos?: number;
  className?: string;
}) => {
  const tokenCount = tokens.length;
  return (
    <div className="flex">
      {tokens.slice(0, maxLogos).map((token, idx) => (
        <Imager
          key={token.symbol + idx}
          src={token.logoURI}
          alt="Token Logo"
          className={`${className} !rounded-full border border-fog bg-fog dark:border-black dark:bg-black`}
          style={{
            marginInlineStart: tokens.length > 1 ? `${'-10'}px` : '0px',
          }}
        />
      ))}
      {tokenCount > maxLogos && (
        <div
          className={`flex h-30 w-30 items-center justify-center rounded-full bg-fog text-12 dark:bg-black`}
          style={{
            marginInlineStart: `${'-10'}px`,
          }}
        >
          +{tokenCount - maxLogos}
        </div>
      )}
    </div>
  );
};
