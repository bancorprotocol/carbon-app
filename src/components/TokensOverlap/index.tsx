import { Token } from 'services/tokens';
import { Imager } from 'elements/Imager';

export const TokensOverlap = ({
  tokens,
  maxLogos = 4,
}: {
  tokens: Token[];
  maxLogos?: number;
}) => {
  const tokenCount = tokens.length;

  return (
    <div className="flex">
      {tokens.slice(0, maxLogos).map((token, idx) => (
        <Imager
          key={token.symbol + idx}
          src={token.logoURI}
          alt="Token Logo"
          className={`h-30 w-30 !rounded-full border border-fog bg-fog dark:border-black dark:bg-black`}
          style={{
            marginLeft: tokens.length > 1 ? `${'-10'}px` : '0px',
          }}
        />
      ))}
      {tokenCount > maxLogos && (
        <div
          className={`flex h-30 w-30 items-center justify-center rounded-full bg-fog text-12 dark:bg-black`}
          style={{
            marginLeft: `${'-10'}px`,
          }}
        >
          +{tokenCount - maxLogos}
        </div>
      )}
    </div>
  );
};
