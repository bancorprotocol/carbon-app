/**
 * Transfers all icons from cloudfront into public folder
 * You can change the params to get icons from other sources
 * How to run: `node ./scripts/copy-icons.mjs`
 */
import { writeFile, mkdir, readFile } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';

const tokensPath = '/public/tokens/ethereum/list.json';
const iconsPath = '/public/tokens/ethereum';
const prefix = 'https://d1wmp5nysbq9xl.cloudfront.net/ethereum/tokens/';

async function main() {
  const tokenFile = join(cwd(), tokensPath);
  const iconsFolder = join(cwd(), iconsPath);
  await mkdir(iconsFolder, { recursive: true });
  const list = JSON.parse(await readFile(tokenFile));
  const iconURIs = list.tokens.map((token) => token.logoURI);
  const getIcons = iconURIs.map(async (uri) => {
    const res = await fetch(uri);
    const text = await res.text();
    const name = uri.replace(prefix, '');
    const path = join(iconsFolder, name);
    return writeFile(path, text);
  });
  const results = await Promise.allSettled(getIcons);
  for (const result of results) {
    if (result.status === 'rejected') console.error(result.reason);
  }
}
main().catch((err) => console.error(err));
