# Overlapping strategy

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
- Strategy is not overlapping
- Strategy has no budget
- Strategy is paused
- Min price has been updated
- Max price has been updated
- Spread has been updated

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
- Min Price
- Max Price
- Spread
- Market Price

**Min Price**
1. Use min price entered by the User
2. Use market price above * 0.99

**Max Price**
1. Use max price entered by the User
2. Use market price above * 1.01

**Spread**
1. Use max price entered by the User
2. Use 0.05

**Market Price**
1. Use Market Price defined above



### Calculate Budget
We need to calculate how the budget is impacted by a change in the strategy.
The user will select an anchor token and provide the amount to deposit or withdraw

Because of a precision error if **not touched** & user budget is zero: **do not calculate budget**.

#### Anchor BUY
If calculated price is above market price: **do not calculate budget**
else : 
- buy budget: initial buy budget +/- user budget
- sell budget: initial buy budget +/- calculated sell budget

#### Anchor SELL
If calculated price is below market price: **do not calculate budget**
else : 
- buy budget: initial sell budget +/- calculated buy budget
- sell budget: initial sell budget +/- user budget


## Chart
### Market Price
The chart displays either : 
1. User Market Price
2. External Market Price

But it doesn't display the calculated market price !
If neither user market price nor extern market price are defined, the chart is **disabled**.

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

Example:
- From: Disposable buy limit: 1000
- To: Overlapping min: 1000, max: 1000 -> will be updated by the form

- From: Disposable sell range: 1000-2000
- To: Overlapping min 1000, max 2000

- From: Recurring buy 1000-2000, sell 2000-3000
- To: Overlapping min: 1000, max: 3000

- From: Recurring buy 1000-2500, sell 2000-3000
- To: Overlapping min: 1000, max: 3000