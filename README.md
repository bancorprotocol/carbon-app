<a href="https://app.carbondefi.xyz/" target="_blank" rel="noopener">
    <img alt="Carbon Webapp" src="./public/carbon.jpg" />
</a>

<h4 align="center">
  <a href="https://www.carbondefi.xyz">CarbonDeFi</a> |
  <a href="https://github.com/bancorprotocol/carbon-contracts">Contracts</a> |
  <a href="https://github.com/bancorprotocol/carbon-sdk">CarbonDeFi SDK</a> |
  <a href="https://github.com/bancorprotocol/fastlane-bot">FastLane</a> |
  <a href="https://www.carbondefi.xyz/blog">Blog</a> |
  <a href="https://docs.carbondefi.xyz">Documentation</a>
</h4>

# CarbonDeFi webapp

Carbon DeFi is an advanced onchain trading protocol enabling automated limit orders, efficiently adjustable with custom price ranges, grid trading like recurring orders, works like a DEX trading bot.

# Setup

## Requirements

To run the app locally, you need the following:

- Node.js 20+
- Yarn
- RPC Node Provider API Key (Alchemy, Infura, etc)

For E2E testing you need a Tenderly account and API Key.

## Run locally

1. Copy the `.env.sample` file to `.env` and fill in the values.

2. In the project directory, you can install all dependencies by running:

```bash
yarn install
```

3. Run the app in development mode by running the following:

```bash
yarn start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

# Test

## Unit/Integration tests & coverage

To launch the test runner, run the following command:

```bash
yarn test
```

If you wish to check the test coverage, run the following command:

```bash
yarn coverage
```

## E2E tests

To run the E2E tests, you must have a Tenderly API key to create and delete forks. You can set it in the `.env` file. Please refer to the [E2E readme](/e2e/README) for more information.

# Build

Running the following, will build the app for production:

```bash
yarn build
```

It will build the for production to the `build` folder.\
It correctly bundles the App in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

# Debug

The '/debug' route is available to debug the app (ex: localhost:3000/debug). It can be accessed by pressing the `Debug` main menu option which is shown when the app is ran locally. From the debug page you can access the following features:

- Set Imposter Account: Allows to set any account in the active network to impersonate.
- Set Tenderly RPC: Allows to set the RPC URL from a Tenderly fork, as well as setting custom addresses for the [carbonController contract](https://github.com/bancorprotocol/carbon-contracts/blob/dev/contracts/carbon/CarbonController.sol) and the [carbonVoucher contract](https://github.com/bancorprotocol/carbon-contracts/blob/dev/contracts/voucher/Voucher.sol). Leaving `Unchecked Signer` checked is recommended as it avoids the need to populate all details of the transaction before returning it, and avoids transaction errors when using the app.
- Tenderly Faucet: After setting the Tenderly RPC and Tenderly Account, the faucet can be used to add tokens to the impersonated wallet.
- Transfer Strategy NFT allows to transfer the NFT that represents the strategy with ID `Strategy ID` to the `Recipient` wallet. The active wallet must be the owner of the NFT to be able to transfer it.
- Notifications: allows to test `loading`, `success`, `failure` and `transaction` rejected notifications.
- Set E2E flag: allows to set the E2E flag to true or false - used when running e2e tests.
- Create Strategy: Allows to easily create multiple strategies - useful for debugging and used in E2E tests. A strategy template must follow the form:

```json
{
  "base": "ETH",
  "quote": "DAI",
  "buy": {
    "min": "1500",
    "max": "1700",
    "budget": "10"
  },
  "sell": {
    "min": "2000",
    "max": "2200",
    "budget": "1000"
  },
  "value": "10",
  "spread": "5"
}
```

where `spread` (fee tier in the UI) is in percentage, and `value` is the number of strategies to create.

# Customization

## Change Network

1. Create a new folder under `src/config` with the name of the network (ex: "polygon")
2. Copy paste the files from `src/config/ethereum` into your folder
3. Update the `common.ts`, `production.ts` & `development.ts` files with your config, pointing to the CarbonDeFi contracts in that network
4. Update the `src/config/index.ts` files to import your files
   `index.ts`

As an example on adding Polygon network:

```typescript
import ethereumDev from './ethereum/development';
import ethereumProd from './ethereum/production';
// Import polygon config
import polygonDev from './polygon/development';
import polygonProd from './polygon/production';

const configs = {
  ethereum: {
    development: ethereumDev,
    production: ethereumProd,
  },
  // add polygon here
  polygon: {
    development: polygonDev,
    production: polygonProd,
  },
};
```

5. Update the `.env` file to use the required network (ex: "polygon") and set your RPC url if you wish to use a custom one not defined under the `common.ts` file.

```bash
# Use polygon network
VITE_NETWORK=polygon
# Use any RPC URL to your network
VITE_CHAIN_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/<API_KEY>
```

### Contracts with version < 5

In case the network is using a version of CarbonController older than 5 then there's no support for extended range for trade by source,
and it is recommended to set VITE_LEGACY_TRADE_BY_SOURCE_RANGE to true in .env to avoid possible reverts.

### Common configuration

The file `common.ts` with type [`AppConfig`](src/config/types.ts) contains important configuration for the app and network. It includes the following:

- `appUrl`: The URL of the app.
- `carbonApi`: The URL of the API.
- `walletConnectProjectId`: The WalletConnect project ID If you wish to add walletConnect, make sure to add it to `selectableConnectionTypes` as well.
- `selectedConnectors`: List of connectors to make available by default in the wallet selection modal that will be shown even if the connector is not injected.
- `blockedConnectors`: List of EIP-6963 injected connectors names to block in the wallet selection modal.
- `isSimulatorEnabled`: Flag to enable the simulation page.
- `network`
  - `name`: Network name.
  - `logoUrl`: Network logo URL.
  - `chainId`: Chain ID.
  - `defaultLimitedApproval`: Optional flag to set the default ERC-20 approval to limited approval. For chains where gas is low, it is recommended to set this flag to true.
  - `gasToken`: Gas token name, symbol, decimals, address and logoURI. This parameter will take priority over the `tokenListOverride`.
  - `blockExplorer`: The name and URL of the block explorer to be used in the notifications and when the network is added to the injected wallet.
  - `rpcUrl`: The RPC URL of the network.
- `defaultTokenPair`: Default token pair to be used in the app when opening the trade, explore, and simulation pages.
- `popularPairs`: List of popular pairs to be used in the app when opening the token selection modal.
- `popularTokens`: List of popular tokens to be used in the app when opening the token selection modal.
- `addresses`/`carbon` and `addresses/utils`: CarbonController, Voucher and multicall contract addresses.
- `tokenListOverride`: Token list override to be used in the app when fetching the token list. Tokens in the list will override any other token with the same address.
- `tokenLists`: List of token lists including the uri and the parser to be used to parse the token list.
- `sdk`/`cacheTTL`: When the app loads, it will ignore any cached data if it is older than the cacheTTL time in milliseconds. If set to 0, the app will always ignore the cache data and fetch new data on load.

#### Gas token different than native token

The CarbonDeFi Contracts, Backend and SDK use an internal fixed address for the native gas token, `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`, hereby called `native token`. If a different `gas token` address than the `native token` address is set in `network.gasToken.address`, the app will hide the `gas token` from the token list and use the `network token` address for all token and pair searches.

### Add pairsToExchangeMapping

The file [`pairsToExchangeMapping.ts`](src/config/utils.ts) contains the mapping of pair symbols to exchange symbol to be used in the TradingView chart.

## Change Colors

The theme is defined in the [`tailwind.config.ts`](./tailwind.config.ts#L36) file.
You can update these colors:

- **background**: used for surfaces
- **primary**: used for buttons and other actionable elements
- **success**: used for positive information like positive ROI.
- **error**: used for error messages & buttons
- **warning**: used for warning messages (mainly in forms)
- **buy**: used for any information related to buy operation
- **sell**: used for any information related to sell operation

> **oklch**: colors are using oklch function to keep contrast no matter the color used. For browser support reason we decided to used the library `culari` to transform oklch into rgb instead of the native css method.

To get the oklch value of an hex color you can use this webapp: https://oklch.com

### Background

Background shades are calculated based on hue and chroma. In [`tailwind.config.ts`](./tailwind.config.ts#L37) you can specify `hue` and `chroma` of the background.

- `hue`: from 0 (pink) to 360 (pink).
- `chroma`: It's recommended to use 0.01 or 0.02 depending on the hue.

### Foreground

All other colors are defined with l,c,h values (see https://oklch.com), and the computed palettes will look like that:

```js
[color]: {
  light: lighten(value, 20%),
  DEFAULT: value,
  dark: darken(value, 50%),
}
```

You can change the % of the `lighten` & `darken` function with the [`lightDark`](./tailwind.config.ts#L20) function.

## Change font

The application uses two fonts :

- BW Gradual for the titles
- Euclid Circle A for the text

You can change the font by changing the files under :

- [`src/assets/font/title`](src/assets/font/title)
- [`src/assets/font/text`](src/assets/font/text)

Use the same naming as the current files.

### Change font weight & format

If you want to change the weight & format of the fonts you'll need to update the [`src/fonts.css`](src/fonts.css) file.

### Use only one font

If you want to use only one font, the easiest is to update [`tailwind.config.ts`](tailwind.config.ts#L83).
Under `theme.fontFamily` change the name of the font.

For example, if you want to only use Carbon Text:

```js
fontFamily: {
  text: ['Carbon-Text', 'sans-serif'],
  title: ['Carbon-Text', 'sans-serif'], // change to Carbon Text here
},
```

You can also remove the unused `@font-face` from the [`src/fonts.css`](src/fonts.css) file.

# License

The license used is the MIT License. You can find it [here](LICENSE).
