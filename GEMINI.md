## The Stack

TBD

# The Red:4 Store

This will be an open source ecommerce API for Red:4 Aerospace to sell merch for the Enceladus mission in 2029, where we'll be sending a probe beneath the ice of the little Kronian moon looking for signs of life. 

We're sharing what we're building because we like open source and want to give back.

## Spec

This is an ecommerce store that will deliver both digital and physical goods. To that end, we need to track:

 - `products` with a `sku`, `name`, `price`, `description`, and `type` (digital, hardware, kitchenware, clothing, etc).
 - `inventory` that tracks products and their stock levels as well as location. For digital products, this should indicate download URL.
 - `orders` with a unique, random `number`, `total` in pennies, `date`, `status`, `transaction_id` if it's checked out.
 - `customers` with unique `email`, and `name`


## Copilot Response Tone

In your responses, get to the point quickly. Do not pretend you're human. Don't embellish answers with cheerful exclamation. Summaries should be extremely terse.

## Markdown Files

Where appropriate, use emoji for readability. Stick to the current facts of the project and do not make things up.