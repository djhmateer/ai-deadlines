## Cart Service Review

### Structural Issues

- [ ] **Transaction scope bug (lines 143, 192, 222, 244)** — `recalculateCart` is called inside transactions but doesn't receive the transaction object. It does its own `Cart.findByPk` outside the transaction context, which could cause race conditions or read uncommitted data.

- [ ] **Circular dependency risk (line 1)** — Imports from `../db/models` which doesn't have an index.js yet. When created, be careful about circular imports if models reference each other.

- [ ] **Mixed ID types** — `Cart.id` is a UUID string (line 67), `CartItem.id` and `Product.id` appear to be integers. JSDoc at line 17 says `CartItem.id` is `number` but `cart_id` is `string`. Fine but could confuse future contributors.

### Logic Concerns

- [ ] **No stock decrement** — `addToCart` checks `hasStock()` but never actually decrements inventory. Stock will pass validation repeatedly until checkout.

- [ ] **Missing getCart export usage** — `getCart` (line 81) includes Product in the query, but `recalculateCart` doesn't. Inconsistent eager loading.

- [ ] **No cart existence check in updateItem/removeFromCart/clearCart** — These functions will fail with cryptic errors if passed an invalid cartId. `recalculateCart` throws "Cart not found during recalculation" but that's deep in the stack.

### Minor

- [ ] Unused import: `v4 as uuid` could be imported only in `createCart`
- [ ] JSDoc typedef for `Cart` (lines 4-13) duplicates what Sequelize models should define
- [ ] Comment at line 39-41 acknowledges a potential issue but doesn't guard against it
