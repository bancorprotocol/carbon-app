# Overlapping strategy
This document covers the logic behind creating and updating overlapping strategies (called concentrated liquidity in the UI). A concentrated liquidity consists of two orders that have an overlapping price range, usually market makers use it to ensure liquidity of a token for traders. An overlapping strategy with a large price range and budget can also serve as an oracle for token price.

An overlapping strategy is defined by 6 dynamic parameters: 
- `min`: minimum price at which to buy
- `max`: maximum price at which to sell
- `spread`: describe the distance between maximum buy price & maximum sell price and the distance between minimum buy price & minimum sell price.
- `marketPrice`: this is the market price at which the tokens are traded currently. Can be provided by an external source (CoinGecko in Carbon), or the user. When only updating the budget, under specific conditions we can calculate the market price of the last trade.
- `anchor`: define which budget can be updated and which one is calculated
- `budget`: the amount of a token to deposit/withdraw on/from the strategy. It'll automatically calculate the amount of the other token to deposit/withdraw

These 6 parameters enable Carbon to calculate both buy & sell orders of the strategy.

## Market Price used for calculation
To calculate the price & budget we need the market price. There are 3 types of market price
- user market price
- external market price
- calculated market price

**User Market Price**

Price set by the user in the UI. It's a search param of the URL `search.marketPrice`.

**External Market Price**

Price given by CoinGecko.
- If one of the token is not listed: `undefined`
- If both token are listed: `basePrice / quotePrice`

**Calculated Market Price**

Price calculated from the initial strategy.
- If no budget: `undefined`
- If not overlapping: `undefined`
- If is paused: `undefined`
- If above market price: `buyMarginalPrice`
- If below market price: `sellMarginalPrice`
- Else: `geomean(buyMarginalPrice, sellMarginalPrice)`

### Hierarchy
The behavior is different if the strategy has been **touched** or not.

**touched**

Price is considered **touched** if : 
- User market price is set
- Min price has been updated
- Max price has been updated
- Spread has been updated
- Strategy is not overlapping (only for edit)
- Strategy has no budget (only for edit)
- Strategy is paused (only for edit)

#### Untouched
If the strategy is **not touched** the hierarchy of market price for calculation is : 
1. User Market Price
2. Calculated Market Price
3. External Market Price

#### Touched
If the strategy is **touched** the hierarchy of market price for calculation is : 
1. User Market Price
2. External Market Price
3. Calculated Market Price


### Example
| Is Overlapping | Has Budget | Paused | Above Market | Below Market | Prices/Spread Changed | Tokens Listed | Has User Price | Market Price Used |
|----------------|------------|--------|--------------|--------------|-----------------------|---------------|----------------|-------------------|
|        X       |      X     |        |              |              |                       |       X       |                | Calculated Price  |
|        X       |      X     |        |              |              |           X           |       X       |                | External Price    |
|        X       |      X     |        |              |              |                       |       X       |        X       | User Price        |
|        X       |      X     |        |              |              |           X           |       X       |        X       | User Price        |
|        X       |            |        |              |              |                       |       X       |                | External Price    |
|        X       |            |        |              |              |                       |               |                | -                 |
|        X       |      X     |    X   |              |              |                       |       X       |                | External Price    |
|        X       |            |        |       X      |              |                       |       X       |                | Buy Marginal      |
|        X       |            |        |       X      |              |           X           |       X       |                | External Price    |
|        X       |            |        |       X      |              |           X           |               |                | Buy Marginal      |
|        X       |            |        |       X      |              |           X           |               |        X       | User Price        |
|        X       |            |        |              |       X      |                       |       X       |                | Sell Marginal     |
|                |            |        |              |              |                       |       X       |                | External Price    |
|                |            |        |              |              |                       |               |                | Calculated Price  |
|                |            |    X   |              |              |                       |               |                | -                 |
|                |            |        |       X      |              |                       |       X       |                | External Price    |
|                |            |        |       X      |              |                       |               |                | Buy Marginal      |

If there is not market price defined, we ask the user to set the **User Market Price**.

## Calculate Order
For **both Edit Price & Edit Budget** we'll calculate the new prices & budgets based on conditions

### Calculate Price
We need to calculate buy.max, buy.marginalPrice, sell.min & sell.marginalPrice.
If strategy is **not touched** we use existing values, else we calculate them.

To calculate prices we need these information : 
- `marketPrice` (defined above)
- `min` (default to `marketPrice * 0.99`)
- `max` (default to `marketPrice * 1.01`)
- `spread` (default to `0.05`)


### Calculate Budget
We need to calculate how the budget is impacted by a change in the strategy.
The user will select an anchor token and provide the amount to deposit or withdraw

Because of a precision error if **not touched** & user budget is zero: **do not calculate budget**.

The user budget and calculated budget will be added or subtracted depending on whether the user wishes to deposit or withdraw.

#### Anchor BUY
If calculated price is above market price: **do not calculate budget**
else : 
- buy budget: initial buy budget +/- user budget
- sell budget: initial sell budget +/- calculated sell budget

#### Anchor SELL
If calculated price is below market price: **do not calculate budget**
else : 
- buy budget: initial buy budget +/- calculated buy budget
- sell budget: initial sell budget +/- user budget


## Chart
### Market Price
The chart displays either : 
1. User Market Price
2. External Market Price

But it doesn't display the calculated market price !
If neither user market price nor external market price are defined, the chart is **disabled**.

### Marginal Price
The marginal price displayed depends on the state of the form : 
- **untouched**: displays the marginal price of the strategy.
- **touched**: displays the marginal price calculated based on the form params.


## Switching between type of strategies
In edit prices, when switching from disposable or recurring to overlapping, we want to follow this behavior : 
- `spread`: Do not set the spread
- `min`: Get the minimum price of both orders
- `max`: Get the maximum value of both orders
If there is only one price, min & max will be the same, we let the overlapping form calculate the closest min/max

### Examples:
- From: Disposable buy limit: 1000
- To: Overlapping min: 1000, max: 1000 -> will be updated by the form
---
- From: Disposable sell range: 1000-2000
- To: Overlapping min 1000, max 2000
---
- From: Recurring buy 1000-2000, sell 2000-3000
- To: Overlapping min: 1000, max: 3000
---
- From: Recurring buy 1000-2500, sell 2000-3000
- To: Overlapping min: 1000, max: 3000