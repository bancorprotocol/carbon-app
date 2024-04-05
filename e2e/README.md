# E2E

## Local

Install Playwright browsers

```shell
yarn playwright install
```

E2E tests call the Tenderly API to create a fork of mainnet at a specific blockNumber. You need to have a [Tenderly account](https://tenderly.co/).

Add in your .env :

```bash
TENDERLY_ACCOUNT=bancor  # account or organisation
TENDERLY_PROJECT=carbon-test-forks
TENDERLY_ACCESS_KEY=...
```

Run in headless mode :

```shell
yarn e2e
```

Run in UI mode :

```shell
yarn e2e --ui
```

## CI

E2E run in a github action on:

- every commit
- when draft PR become ready for review

## Screenshots

Screenshots are taken during E2E and images are pushed automatically on the current branch

Screenshots are only taken:

- In a Github Action
- If PR is not draft

<p style="border:solid 1px #303030; background-color: #30303030; border-radius:4px; padding:8px 16px">
Screenshots are not taken on draft commits as the local branch would need to be merged on each change.
<p>

## Tips

Wait for an element before asserting.

```typescript
// Wait for the modal with utils `waitFor`
await waitFor(page, 'modal');
await expect(page.getTestId('modal-title')).toHaveText('Confirm');

// Wait for a list using locator
const list = page.locator('[data-testid="strategy-list"] > li');
await list.waitFor({ state: 'visible' });
await expect(list.toCount(1));
```

TestId must be unique in the context. When testing a list, select the element first:

```typescript
const list = page.locator('[data-testid="strategy-list"] > li');
const [first] = await list.all();
await expect(first.getTestId('strategy-pair')).toHaveText('ETH/DAI');
```

As the same network was used for all tests, mutating a strategy in one test might impact another test. For now, it is suggested to try to use different token pairs for each test to avoid unwanted side effect, for example:

- `ETH/DAI`: Create recurring strategy
- `ETH/BNT`: Create overlapping strategy
- `ETH/USDC`: Trade Buy
- `USDC/USDT`: Trade Sell

## Common Errors

- **Error**: `Executable doesn't exist`
- **Solution**: run `yarn playwright install`
- **Description**: Browsers are not installed locally yet

---

- **Error**: `Page is closed`
- **Solution**: Increase timeout of test
- **Description**: This error happens if test is longer that the defaut timeout (30s). It can append at any stage of the test
- **Example**:

```typescript
test('Create strategy', ({ page }) => {
  test.setTimeout(60_000); // timeout of 60s for this test
  ...
})
```
