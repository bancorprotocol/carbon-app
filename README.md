# Carbon Webapp

## Setup

Copy the `.env.sample` file to `.env` and fill in the values.

## Available Scripts

In the project directory, you can run:

### `yarn install`

Installs all dependencies.

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


### `yarn test`

Launches the test runner.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles the App in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Change network
1. Create a new folder under `src/config` with the name of the network (ex: "polygon")
2. Copy paste the files from `src/config/ethereum` into your folder
3. Update the `production.ts` & `development.ts` files with your config
3. Update the `src/config/index.ts` files to import your files
`index.ts`
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
4. Update the `.env` file to use polygon network and set your RPC url
```bash
# Use polygon network
VITE_NETWORK=polygon
# Use any RPC URL to your network
VITE_CHAIN_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/<API_KEY>
```

## Change Colors
The theme is defined in the [`tailwind.config.js`](./tailwind.config.js#L36) file.
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
Background shades are calculated based on hue and chroma. In [`tailwind.config.js`](./tailwind.config.js#L38) you can specify `hue` and `chroma` of the background.
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
You can change the % of the `lighten` & `darken` function with the [`lightDark`](./tailwind.config.js#L18)  function.
