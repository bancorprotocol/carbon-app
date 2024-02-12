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
4. Update the `.env` file to use polygon network
```bash
# Use polygon network
VITE_NETWORK=polygon
```