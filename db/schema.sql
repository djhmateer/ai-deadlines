-- Database schema for The Red:4 Store, designed for SQLite.

-- Customers table: Stores unique customer information.
CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Products table: Defines the products available for sale.
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL, -- Stored in pennies
    type TEXT NOT NULL CHECK (type IN ('digital', 'hardware', 'kitchenware', 'clothing')),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Inventory table: Tracks stock levels and locations for products.
CREATE TABLE inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    stock_level INTEGER NOT NULL DEFAULT 0,
    location TEXT, -- Warehouse location or download URL for digital products
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (id)
);

-- Orders table: Records customer orders.
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number TEXT UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL,
    total INTEGER NOT NULL, -- Stored in pennies
    status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'processed', 'shipped', 'delivered', 'cancelled')),
    transaction_id TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers (id)
);

-- Order items table (associates products with orders)
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price INTEGER NOT NULL, -- Price at the time of purchase, in pennies
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (product_id) REFERENCES products (id),
    UNIQUE (order_id, product_id)
);

-- Indexes for performance
CREATE INDEX idx_customers_email ON customers (email);
CREATE INDEX idx_products_sku ON products (sku);
CREATE INDEX idx_orders_customer_id ON orders (customer_id);
CREATE INDEX idx_order_items_order_id ON order_items (order_id);
CREATE INDEX idx_order_items_product_id ON order_items (product_id);
