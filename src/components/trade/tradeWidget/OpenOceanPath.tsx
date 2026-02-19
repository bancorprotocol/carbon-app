import { TokensOverlap } from 'components/common/tokensOverlap';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { useImportTokens, useTokens } from 'hooks/useTokens';
import { FC, Fragment, useMemo } from 'react';
import { OpenOceanSwapPath } from 'services/openocean';

interface Props {
  path: OpenOceanSwapPath;
}

const useImportMissingTokens = (path: OpenOceanSwapPath) => {
  const addresses = useMemo(() => {
    const addresses = new Set<string>();
    addresses.add(path.from);
    addresses.add(path.to);
    for (const route of path.routes) {
      for (const subroute of route.subRoutes) {
        addresses.add(subroute.from);
        addresses.add(subroute.to);
      }
    }
    return Array.from(addresses);
  }, [path]);
  return useImportTokens(addresses);
};

export const OpenOceanPath: FC<Props> = ({ path }) => {
  const { getTokenById } = useTokens();
  useImportMissingTokens(path);
  return (
    <ol className="grid gap-8 text-12">
      {path.routes.map((route, i) => (
        <li key={`route-${i}`} className="flex items-center gap-8">
          <span>{route.percentage}%</span>
          <ol className="flex items-center gap-4 flex-wrap">
            {route.subRoutes.map((subroute, j) => {
              const from = getTokenById(subroute.from);
              const to = getTokenById(subroute.to);
              return (
                <Fragment key={j}>
                  {!!j && (
                    <svg
                      role="separator"
                      width="16"
                      height="4"
                      viewBox="0 0 16 4"
                      fill="var(--color-main-0)"
                      fillOpacity="0.2"
                    >
                      <circle cx="2" cy="2" r="2" />
                      <circle cx="8" cy="2" r="2" />
                      <circle cx="14" cy="2" r="2" />
                    </svg>
                  )}
                  <Tooltip
                    element={
                      <div className="grid gap-8">
                        <h4>
                          {from?.symbol} / {to?.symbol}
                        </h4>
                        <hr className="border-main-300" />
                        <ul className="grid gap-4">
                          {subroute.dexes.map((dex) => (
                            <li key={dex.id} className="grid gap-8 grid-cols-2">
                              <span className="justify-self-start">
                                {dex.dex}
                              </span>
                              <span className="justify-self-end">
                                ({dex.percentage}%)
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    }
                  >
                    <li className="flex items-center gap-4">
                      <TokensOverlap tokens={[from, to]} size={16} />
                      <span className="px-8 py-2 bg-main-800 rounded-full text-nowrap">
                        {subroute.dexes.length} Dexes
                      </span>
                    </li>
                  </Tooltip>
                </Fragment>
              );
            })}
          </ol>
        </li>
      ))}
    </ol>
  );
};
