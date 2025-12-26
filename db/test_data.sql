-- Test data for the Red:4 Store

-- Add Customers
INSERT INTO customers (id, email, name) VALUES
(1, 'cassini@test.com', 'Cassini Huygens'),
(2, 'jp.plume@test.com', 'J.P. Plume'),
(3, 'tigerstripe@test.com', 'Tiger Stripe'),
(4, 'cryovolcano@test.com', 'Cryo Volcano'),
(5, 'europa.clipper@test.com', 'Europa Clipper');

-- Add Products
INSERT INTO products (id, sku, name, description, price, type) VALUES
(1, 'RED4-0001', 'Enceladus Cryovolcanic Plume Poster', 'A high-resolution poster of Enceladus ejecting water ice and vapor from its south polar region. Did you know these plumes contain salts and organic molecules?', 999, 'digital'),
(2, 'RED4-0002', '"Tiger Stripes" T-Shirt', 'A stylish t-shirt featuring the four major sulci (grooves) of Enceladus: Baghdad, Cairo, Damascus, and Alexandria Sulcus.', 2499, 'clothing'),
(3, 'RED4-0003', 'Subsurface Ocean Sample Mug', 'A mug that looks like a core sample, celebrating the global ocean of liquid water beneath Enceladus''s icy crust.', 1499, 'kitchenware'),
(4, 'RED4-0004', 'Enceladus Mission Patch', 'An embroidered patch for the Red:4 Enceladus mission. A must-have for aspiring space explorers!', 799, 'hardware'),
(5, 'RED4-0005', 'Cosmic Dust Collector (Model)', 'A 1:10 scale model of the Cosmic Dust Analyzer used on Cassini, which found silica grains suggesting hydrothermal vents on Enceladus.', 4999, 'hardware'),
(6, 'RED4-0006', 'Journey to Enceladus (E-Book)', 'A digital book detailing the planned 2029 mission and the science behind the search for life. Enceladus is only ~500km in diameter!', 1299, 'digital'),
(7, 'RED4-0007', 'Mimas "Death Star" Beanie', 'A warm beanie celebrating Saturn''s other fascinating moon, Mimas, and its giant Herschel crater.', 1999, 'clothing'),
(8, 'RED4-0008', 'Saturn''s Rings Desk Lamp', 'A beautiful desk lamp that projects a faint replica of Saturn''s rings onto your ceiling.', 7999, 'hardware'),
(9, 'RED4-0009', 'Hydrothermal Vent Scented Candle', 'What do hydrothermal vents smell like? We''re not sure, but we imagine it''s something like this complex, mineral-rich scented candle.', 2999, 'kitchenware'),
(10, 'RED4-0010', 'Enceladus Globe', 'A detailed 12-inch globe of Enceladus, showing all known surface features. Its surface is one of the most reflective in the Solar System!', 5999, 'hardware');

-- Add Inventory
INSERT INTO inventory (product_id, stock_level, location) VALUES
(1, 9999, '/downloads/enceladus-plume.jpg'),
(2, 100, 'Warehouse A'),
(3, 250, 'Warehouse B'),
(4, 500, 'Warehouse A'),
(5, 50, 'Warehouse C'),
(6, 9999, '/downloads/journey-to-enceladus.epub'),
(7, 150, 'Warehouse B'),
(8, 75, 'Warehouse C'),
(9, 200, 'Warehouse A'),
(10, 120, 'Warehouse C');

-- Add Orders and Order Items
-- Order 1
INSERT INTO orders (id, number, customer_id, total, status, transaction_id) VALUES (1, 'ORD-2025-0001', 1, 3498, 'shipped', 'txn_1');
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 999),
(1, 2, 1, 2499);

-- Order 2
INSERT INTO orders (id, number, customer_id, total, status, transaction_id) VALUES (2, 'ORD-2025-0002', 2, 1499, 'paid', 'txn_2');
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(2, 3, 1, 1499);

-- Order 3
INSERT INTO orders (id, number, customer_id, total, status, transaction_id) VALUES (3, 'ORD-2025-0003', 3, 5798, 'shipped', 'txn_3');
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(3, 4, 1, 799),
(3, 5, 1, 4999);

-- Order 4
INSERT INTO orders (id, number, customer_id, total, status, transaction_id) VALUES (4, 'ORD-2025-0004', 4, 2598, 'paid', 'txn_4');
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(4, 6, 2, 1299);

-- Order 5
INSERT INTO orders (id, number, customer_id, total, status, transaction_id) VALUES (5, 'ORD-2025-0005', 5, 1999, 'shipped', 'txn_5');
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(5, 7, 1, 1999);

-- Order 6
INSERT INTO orders (id, number, customer_id, total, status, transaction_id) VALUES (6, 'ORD-2025-0006', 1, 10998, 'paid', 'txn_6');
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(6, 8, 1, 7999),
(6, 9, 1, 2999);

-- Order 7
INSERT INTO orders (id, number, customer_id, total, status, transaction_id) VALUES (7, 'ORD-2025-0007', 2, 5999, 'shipped', 'txn_7');
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(7, 10, 1, 5999);

-- Order 8
INSERT INTO orders (id, number, customer_id, total, status, transaction_id) VALUES (8, 'ORD-2025-0008', 3, 4998, 'paid', 'txn_8');
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(8, 2, 2, 2499);

-- Order 9
INSERT INTO orders (id, number, customer_id, total, status, transaction_id) VALUES (9, 'ORD-2025-0009', 4, 2298, 'shipped', 'txn_9');
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(9, 4, 1, 799),
(9, 3, 1, 1499);

-- Order 10
INSERT INTO orders (id, number, customer_id, total, status, transaction_id) VALUES (10, 'ORD-2025-0010', 5, 10997, 'paid', 'txn_10');
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(10, 1, 1, 999),
(10, 5, 2, 4999);

