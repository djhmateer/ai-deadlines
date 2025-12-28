// NOTE: Circular dependency risk - when db/models/index.js is created, ensure
// models are initialized before being imported here to avoid undefined references.
import { DB, Product, Cart, CartItem } from '../db/models';
import { v4 as uuid } from 'uuid';

// ID types: Cart.id is a UUID string, CartItem.id and Product.id are integers.

/**
 * Recalculates the total and item count for a given cart.
 * This is a helper function to ensure consistency.
 *
 * @param {string} cartId - The ID of the cart to recalculate.
 * @param {object} [transaction] - Sequelize transaction object.
 * @returns {Promise<Cart>} - The updated cart.
 */
async function recalculateCart(cartId, transaction) {
  const cart = await Cart.findByPk(cartId, {
    include: [{ model: CartItem, as: 'items', include: [Product] }],
    transaction
  });

  if (!cart) {
    throw new Error('Cart not found');
  }

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  cart.total = total;
  cart.item_count = itemCount;
  await cart.save({ transaction });

  return cart;
}


/**
 * Creates a new shopping cart.
 *
 * @param {number} [customerId] - The ID of the customer creating the cart.
 * @returns {Promise<Cart>} - The newly created cart.
 */
export async function createCart(customerId) {
  // 1. Create a new cart record in the database.
  // 2. If a customerId is provided, associate the cart with the customer.
  // 3. Set initial total and item_count to 0.
  // 4. Return the newly created cart object.
  const cart = await Cart.create({
    id: uuid(), // Assuming the ID is a UUID as per the spec examples
    customer_id: customerId || null,
    total: 0,
    item_count: 0
  });
  return cart;
}

/**
 * Retrieves a cart by its ID, including its items.
 *
 * @param {string} cartId - The ID of the cart to retrieve.
 * @returns {Promise<Cart|null>} - The cart object with items, or null if not found.
 */
export async function getCart(cartId) {
  // 1. Find the cart in the database by its ID.
  // 2. If found, return the cart object.
  // 3. Otherwise, return null.
  return Cart.findByPk(cartId, {
    include: [{ model: CartItem, as: 'items', include: [Product] }]
  });
}

/**
 * Adds a product to a cart.
 *
 * @param {Cart} cart - The cart object.
 * @param {Product} product - The product object to add.
 * @param {number} quantity - The number of units to add.
 * @returns {Promise<Cart>} - The updated cart.
 */
export async function addToCart(cart, product, quantity) {
  // 1. Validate that the product exists and the quantity is positive.
  // 2. Check product availability (stock for physical, unlimited for digital).
  // 3. Check if the product is already in the cart.
  //    - If yes, update the quantity.
  //    - If no, create a new cart item.
  // 4. Snapshot the product price and store it with the cart item.
  // 5. Recalculate the cart's total and item_count.
  // 6. Update the cart record in the database.
  // 7. Return the updated cart.
  if (quantity <= 0) {
    throw new Error("Quantity must be a positive integer");
  }

  // Assuming Product model has these methods/properties based on test specs.
  if (!product.isAvailable()) {
    throw new Error("Product not available");
  }

  // Digital products have unlimited stock.
  // NOTE: Stock is validated here but not decremented - that happens at checkout.
  if (product.type !== 'digital' && !product.hasStock(quantity)) {
    throw new Error("Not enough stock");
  }

  return DB.transaction(async (t) => {
    let cartItem = await CartItem.findOne({
      where: { cart_id: cart.id, product_id: product.id },
      transaction: t
    });

    if (cartItem) {
      // If item exists, update quantity
      cartItem.quantity += quantity;
      await cartItem.save({ transaction: t });
    } else {
      // Otherwise, create a new item
      await CartItem.create({
        cart_id: cart.id,
        product_id: product.id,
        quantity: quantity,
        price: product.price, // Snapshot the price
      }, { transaction: t });
    }

    // Recalculate cart totals and return the updated cart
    return recalculateCart(cart.id, t);
  });
}

/**
 * Updates the quantity of an item in the cart.
 *
 * @param {string} cartId - The ID of the cart.
 * @param {number} productId - The ID of the product to update.
 * @param {number} newQuantity - The new quantity.
 * @returns {Promise<Cart>} - The updated cart.
 */
export async function updateItem(cartId, productId, newQuantity) {
  // 1. Validate that the quantity is a positive integer.
  // 2. Find the cart item.
  // 3. Check product stock if it's a physical item.
  // 4. Update the item's quantity.
  // 5. Recalculate the cart total.
  // 6. Update the cart record.
  // 7. Return the updated cart.
  if (newQuantity <= 0) {
    throw new Error("Quantity must be a positive integer");
  }

  const cartExists = await Cart.findByPk(cartId);
  if (!cartExists) {
    throw new Error("Cart not found");
  }

  return DB.transaction(async (t) => {
    const cartItem = await CartItem.findOne({
      where: { cart_id: cartId, product_id: productId },
      include: [Product],
      transaction: t
    });

    if (!cartItem) {
      throw new Error("Item not found in cart");
    }

    const product = cartItem.Product;
    // Digital products have unlimited stock.
    if (product.type !== 'digital' && !product.hasStock(newQuantity)) {
      throw new Error("Not enough stock");
    }

    cartItem.quantity = newQuantity;
    await cartItem.save({ transaction: t });

    return recalculateCart(cartId, t);
  });
}

/**
 * Removes an item from the cart.
 *
 * @param {string} cartId - The ID of the cart.
 * @param {number} productId - The ID of the product to remove.
 * @returns {Promise<Cart>} - The updated cart.
 */
export async function removeFromCart(cartId, productId) {
  // 1. Find and delete the cart item.
  // 2. Recalculate the cart total and item_count.
  // 3. Update the cart record.
  // 4. If the cart is now empty, consider expiring it.
  // 5. Return the updated cart.
  const cartExists = await Cart.findByPk(cartId);
  if (!cartExists) {
    throw new Error("Cart not found");
  }

  return DB.transaction(async (t) => {
    const cartItem = await CartItem.findOne({
      where: { cart_id: cartId, product_id: productId },
      transaction: t
    });

    if (!cartItem) {
      throw new Error("Item not found in cart");
    }

    await cartItem.destroy({ transaction: t });

    return recalculateCart(cartId, t);
  });
}

/**
 * Clears all items from a cart.
 *
 * @param {string} cartId - The ID of the cart to clear.
 * @returns {Promise<Cart>} - The updated (empty) cart.
 */
export async function clearCart(cartId) {
  // 1. Delete all cart items associated with the cartId.
  // 2. Reset the cart's total and item_count to 0.
  // 3. Keep the cart record for analytics.
  // 4. Return the updated cart object.
  const cartExists = await Cart.findByPk(cartId);
  if (!cartExists) {
    throw new Error("Cart not found");
  }

  return DB.transaction(async (t) => {
    await CartItem.destroy({
      where: { cart_id: cartId },
      transaction: t
    });

    return recalculateCart(cartId, t);
  });
}