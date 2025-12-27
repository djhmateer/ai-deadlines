## Shopping Cart Specification

### Overview
The shopping cart manages customer selections of products before checkout. Carts are session-based and can be persisted per customer.

### Data Model

#### Cart
- `id`: Unique identifier (UUID or auto-increment integer)
- `customer_id`: Reference to customer (optional for anonymous carts)
- `total`: Sum of all item prices in pennies
- `item_count`: Total number of items in cart
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `expires_at`: Optional expiration timestamp for abandoned carts

#### Cart Item
- `id`: Unique identifier
- `cart_id`: Reference to cart
- `product_id`: Reference to product
- `quantity`: Number of units
- `price`: Price per unit in pennies (snapshot at time of add)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Business Logic

#### Add to Cart
- Product must exist and be available
- Quantity must be positive integer
- If product already in cart, update quantity
- Stock level must not be exceeded for hardware/physical items
- Digital items have unlimited availability
- Capture product price at time of addition (snapshot pricing)
- Recalculate cart total

#### Update Cart Item
- Quantity must be positive integer
- Validate against available stock for physical items
- Recalculate cart total

#### Remove from Cart
- Delete cart item
- Recalculate cart total
- If cart is empty, optionally expire it

#### Clear Cart
- Delete all items
- Reset total and item count
- Keep cart record for analytics

### Validation Rules

- Product must exist
- Quantity must be positive integer
- Stock level must not be exceeded for hardware/physical items
- Digital items have unlimited availability
- Cart total must be calculated as sum of all item subtotals
- Prices are immutable once added to cart (snapshot pricing)
