# E2E

### Local
Headless mode : 
```shell
yarn e2e
```

UI mode :
```shell
yarn e2e --ui
```

### CI
E2E run in a github action on:
- every commit
- when draft PR become ready for review

### Screenshot
Screenshot are taken during E2E and images are pushed automatically on the current branch

Screenshot are only taking : 
- In Github Action
- If PR is not draft

<p style="border:solid 1px #303030; background-color: #30303030; border-radius:4px; padding:8px 16px">
We do not run screenshot on draft commit as we would need to merge the local branch on each change
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


## Common Errors

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