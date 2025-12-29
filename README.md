# 🚀 Red:4 Store

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-ORM-52B0E7?logo=sequelize&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Production-4169E1?logo=postgresql&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-Testing-C21325?logo=jest&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

The official merchandise API for **Red:4 Aerospace** — powering sales for the 2029 Enceladus mission.

We're sending a probe beneath the ice of Saturn's moon to look for signs of life. You can buy the t-shirt.

## What is this?

An open source ecommerce API built to sell both digital and physical goods. Mission patches, apparel, hardware models, and digital downloads — all through a clean REST interface.

## Stack

| Layer | Tech |
|-------|------|
| API | Express |
| ORM | Sequelize |
| Dev/Test DB | SQLite (in-memory for tests) |
| Production DB | PostgreSQL |
| Testing | Jest |

## Getting Started

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Start the server
pnpm start
```

## Project Structure

```
├── db/
│   ├── models/      # Sequelize models
│   └── dev.db       # Development database
├── lib/             # Business logic and services
├── tests/           # Jest test suites
└── docs/            # Guidelines and reviews
```

## Data Model

- **Products** — SKU, name, price, description, type (digital, hardware, kitchenware, clothing)
- **Inventory** — Stock levels, locations, download URLs for digital items
- **Orders** — Order number, total (in pennies), status, transaction ID
- **Customers** — Email, name
- **Carts** — Shopping cart with items, totals, expiration

## Contributing

We welcome contributions. Read `CLAUDE.md` for coding standards and style guides.

## Why Open Source?

We like open source. We want to give back.

Also, if you find bugs in our store before launch, that's fewer angry customers when we're trying to fund a mission to an ice moon 1.2 billion kilometers away.

## License

MIT — See [LICENSE](LICENSE) for details.
