# Activity
To query activities we need two endpoints : 
- `/v1/activity` returns the list of activities, filtered and paginated
- `/v1/activity/meta` return meta information concerning the filtered result

The meta endpoint provides information to the frontend to manage filtering and pagination.


## Activity List

**Examples**
- Last 10 activities that happened: `/v1/activity?limit=10`
- All activities owned by user 0x123: `/v1/activity?ownerId=0x123`
- Trade activities for the pair USDC/DAI: `/v1/activity?actions=buy,sell&pairs=0xA0...eB48_0x6B...d0F`


**Search Params**
```typescript
interface ActivityListSearch {
  /** address of a strategy owner */
  ownerId?: string;
  /**
   * List of ID separated by comma
   * @example 170....339,170...385
   */
  strategyIds?: string;
  /**
   * List of pairs of token with this format ${base}_${quote} separated by comma 
   * @example 0xee...eee_0xa0...b48,0xA0...B48_0x6B...d0F
   */
  pairs?: string;
  /**
   * List of action of the activity separated by comma
   * @example buy,sell
   */
  actions?: ('create' | 'deposit' | 'withdraw' | 'edit' | 'delete' | 'transfer' | 'buy' | 'sell' | 'pause')[];
  /**
   * Amount of items to return
   * @default 10_000
   */
  limit?: number;
  /**
   * Index of the first item to return
   * @default 0
   */
  offset?: number;
  /**
   * Return activities that happened after this date in Unix time (seconds)
   */
  start?: number;
  /**
   * Return activities that happened before this date in Unix time (seconds)
   */
  end?: number;
}
```


## Activity Meta
The meta endpoint uses the same params as the activity list without the pagination params (limit & offset)

**Example**
Get all strategy IDs owned by user 0x123:
```typescript
const { strategies } = await fetch('https://api.carbondefi.xyz/v1/activity/meta?owner=0x123').then(res => res.json());
/** strategies is a Record of ID -> Pair */
const ids = Object.key(strategies);
```

Get all the pairs of strategies that have been delete:
```typescript
const { pairs } = await fetch('https://api.carbondefi.xyz/v1/activity/meta?actions=delete').then(res => res.json());
```


Get the last 10 activities from user 0x123:
```typescript
const { size } = await fetch('https://api.carbondefi.xyz/v1/activity/meta?owner=0x123').then(res => res.json());
const offset = size - 10;
const activities = await fetch(`https://api.carbondefi.xyz/v1/activity/meta?owner=0x123&limit=10&offset=${offset}`);
```


**Search Params**
```typescript
type ActivityMetaSearch = Omit<ActivityListSearch, 'limit' | 'offset'>;
```