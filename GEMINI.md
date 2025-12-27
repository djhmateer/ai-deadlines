# The Red:4 Store

This will be an open source ecommerce API for Red:4 Aerospace to sell merch for the Enceladus mission in 2029, where we'll be sending a probe beneath the ice of the little Kronian moon looking for signs of life. 

We're sharing what we're building because we like open source and want to give back.
  
## The Stack

- Express for the API
- Sequelize for data access
- SQLite3 for the development and testing database,
PostgreSQL for production

## Sequelize

All model code should adhere to the following:
- Every model will have a `tableName` setting
- The models will have an `index.js` module that
instantiates Sequelize, using SQLite for testing and
development, Postgres for production.
- The `index.js` module will export each model, as well
as the database instance as `DB.
Every model will follow the pattern:
js
import { DataTypes, Model } from 'sequelize';
class User extends Model {
static or factory methods
instance methods
}
exports.init = function(sequelize){
User.init({
schema goes here
}, {
hooks:
{},
tableName:
"users"
78
underscored:
true,
sequelize
})
}

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

## Database Style Guide

- All SQL files (.sql), database files (.db, .sqlite) will live in the `/db` directory.
- SQLite will be used for development and stored at `/db/dev.db`
- SQLite in-memory will be used for testing and build.  
- No Triggers under any circumstances
- Fields such as `status` or `type` should use enums
- PostgreSQL will be used for production.
- All ORM models will live in the `/db/models` directory.
- Database tables will be lower cased using underscores.
- Every table will have an auto increment integer primary key called `id`.
- `char`, `varchar` and `nvarchar` are never to be used for string fields, only `text`.
- Every table should have `created_at` and `updated_at` timestamps.
- Many to Many relationships (tables with more than one foreign key) will have compound primary keys, never a single ID with compound unique.

## Test Style Guide

All tests will be run with Jest. In addition:

- One assertion per test, _no_ exceptions
- Tests should arrange the test data in `beforeAll` blocks
- `describe` blocks should have long descriptive names.
- Tests should have long, descriptive names: `this is a test name`.
- The word "should" will be avoided in test names. A test either passes or fail, it `is`, `is not`, `does`, or `does not`. There is no try.
- Tests will be nested, with the outer `describe` block indicating the main test feature, and the first inner `describe` block being the "happy path" - which is what happens when everything works as expected. The rest of the nested blocks will be devoted to "sad path" tests, with bad data, null values, and any other unexpected settings we can think of.  Use this exact pattern:

```js
import { someMethod } from "./some_service.js";

// The happy path, when everything works
describe("The thing I'm trying to test", () => {
  // arrange
  let testThing;
  beforeAll(async () => {
    testThing = await someMethod();
  });

  // act
  it("will initialize", async () => {
    // make sure the testThing initializes properly
    // assert
    expect(testThing).toBeDefined();
  });
  // rest of tests go down here
});

// The sad path, with error conditions
describe("The things I'm trying to avoid", () => {
  describe("Error conditions with initialization", () => {
    // act
    it("will throw an X type error with message Y", async () => {
      expect(someMethod(badData)).toThrowError("Some message");
    });
  });

  describe("Another set of error conditions", () => {
    // act
    it("will throw an X type error with message Y", async () => {
      expect(someMethod(badData)).toThrowError("Some message");
    });
  });
  // rest of tests go down here
});
```