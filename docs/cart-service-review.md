## Cart Service Review

### Structural Issues

- [x] **Transaction scope bug** — `recalculateCart` now accepts and uses transaction parameter.

- [x] **Circular dependency risk** — Added comment at top of file noting the risk.

- [x] **Mixed ID types** — Added clarifying comment: Cart.id is UUID string, others are integers.

### Logic Concerns

- [x] **No stock decrement** — Added comment clarifying stock is validated but decremented at checkout.

- [x] **Inconsistent eager loading** — `recalculateCart` now includes Product like `getCart` does.

- [x] **No cart existence check** — Added early cart existence checks to updateItem/removeFromCart/clearCart.

### Minor

- [x] uuid import is used in `createCart` — not actually unused, left as-is.
- [x] JSDoc typedefs removed — models will define these.
- [x] Guard in recalculateCart simplified — now throws clear "Cart not found" error.
