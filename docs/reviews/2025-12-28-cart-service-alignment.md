## Cart Service Alignment Review — 2025-12-28

### Summary

Code review and fixes for `lib/cart_service.js` and `tests/cart.test.js` to align service implementation with test expectations and resolve structural issues.

### Initial Issues Identified

1. **Function naming mismatch** — Service exported `removeItem`, tests imported `removeFromCart`
2. **Signature mismatches** — `updateItem`, `removeFromCart`, `clearCart` expected cartId strings, tests passed cart objects
3. **Behavior mismatch** — `updateItem` with quantity 0 called `removeItem`, tests expected error
4. **Style guide deviation** — Tests used `beforeEach` instead of `beforeAll` (kept as-is due to mutating test state)
5. **Jest ESM configuration** — Tests failed to parse ES module imports
6. **Missing dependency** — `uuid` package not installed
7. **Missing models** — `db/models/index.js`, Cart, CartItem models don't exist yet

### Changes Made

#### Commit 66ef15d — "fix: Align cart service and tests, configure Jest for ESM"

- Renamed `removeItem` → `removeFromCart` in cart_service.js
- Fixed `updateItem` to reject quantity ≤ 0 instead of treating 0 as removal
- Updated test calls to pass `cart.id` strings instead of cart objects
- Added `uuid` dependency
- Configured Jest with `--experimental-vm-modules` for ESM support
- Renamed GEMINI.md → CLAUDE.md, tests/cart.spec.js → tests/cart.test.js
- Removed superseded lib/cart.js stub

#### Code Review Fixes (uncommitted)

Structural:
- `recalculateCart` now accepts transaction parameter and uses it for all DB operations
- Added circular dependency warning comment at file top
- Added ID types clarification comment (Cart.id is UUID string, others are integers)
- Removed duplicate JSDoc typedefs (models will define these)

Logic:
- Added comment clarifying stock is validated but decremented at checkout
- `recalculateCart` now includes Product in eager loading (consistent with `getCart`)
- Added early cart existence checks to `updateItem`, `removeFromCart`, `clearCart`

Minor:
- Simplified error message in `recalculateCart` guard

#### Other Files

- `docs/code-review-guidelines.md` — Replaced corporate boilerplate with 5 simple rules for small team
- `docs/cart-service-review.md` — Created task list of issues, updated with fixes

### Pending Work

- Tests cannot run until `db/models/index.js` is created with Cart, CartItem models
- `db/models/product.js` uses CommonJS exports but project uses ESM — needs fix
- Uncommitted cart_service.js fixes and new docs need to be committed

### Files Modified

- `lib/cart_service.js`
- `tests/cart.test.js`
- `package.json`
- `docs/code-review-guidelines.md`
- `docs/cart-service-review.md`
