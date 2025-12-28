import { v4 as uuid } from "uuid";
import {
  createCart,
  addToCart,
  updateItem,
  removeFromCart,
  clearCart,
} from "../lib/cart.js";

// Mocking the models since they don't exist yet.
// We are imagining a Product model.
const mockProductDigital = {
  id: 1,
  name: "Enceladus Mission Patch",
  price: 1500,
  type: "digital",
  isAvailable: () => true,
  hasStock: () => true, // Digital products always have stock
};

const mockProductPhysical = {
  id: 2,
  name: "Red:4 T-Shirt",
  price: 2500,
  type: "clothing",
  stock: 10,
  isAvailable: () => true,
  hasStock: (quantity) => mockProductPhysical.stock >= quantity,
};

const mockProductOutOfStock = {
    id: 3,
    name: "Limited Edition Model Ship",
    price: 15000,
    type: "hardware",
    stock: 0,
    isAvailable: () => true,
    hasStock: (quantity) => mockProductOutOfStock.stock >= quantity,
};

const mockProductNotAvailable = {
    id: 4,
    name: "Discontinued Item",
    price: 1000,
    type: "kitchenware",
    isAvailable: () => false,
    hasStock: () => true,
};

describe("Shopping Cart Business Logic", () => {
    let cart;

    beforeEach(async () => {
        // In a real scenario, this would create a cart in the database.
        // For now, we'll simulate the object that the service would return.
        cart = await createCart();
    });

    describe("Add to Cart: The happy path, when everything works", () => {
        it("adds a digital product to an empty cart", async () => {
            const updatedCart = await addToCart(cart, mockProductDigital, 1);
            expect(updatedCart.items.length).toBe(1);
        });

        it("sets the correct item count when a new item is added", async () => {
            const updatedCart = await addToCart(cart, mockProductDigital, 1);
            expect(updatedCart.item_count).toBe(1);
        });

        it("sets the correct total when a new item is added", async () => {
            const updatedCart = await addToCart(cart, mockProductDigital, 1);
            expect(updatedCart.total).toBe(1500);
        });

        it("adds a physical product to an empty cart", async () => {
            const updatedCart = await addToCart(cart, mockProductPhysical, 1);
            expect(updatedCart.items.length).toBe(1);
        });

        it("updates the quantity if the same product is added again", async () => {
            await addToCart(cart, mockProductDigital, 1);
            const updatedCart = await addToCart(cart, mockProductDigital, 2);
            expect(updatedCart.items[0].quantity).toBe(3);
        });

        it("recalculates the total when adding more of the same item", async () => {
            await addToCart(cart, mockProductDigital, 1);
            const updatedCart = await addToCart(cart, mockProductDigital, 2);
            expect(updatedCart.total).toBe(1500 * 3);
        });

        it("takes a snapshot of the price at the time of adding", async () => {
            const updatedCart = await addToCart(cart, mockProductDigital, 1);
            expect(updatedCart.items[0].price).toBe(mockProductDigital.price);
        });
    });

    describe("Add to Cart: The sad path, with error conditions", () => {
        it("throws an error if the product is not available", async () => {
            await expect(addToCart(cart, mockProductNotAvailable, 1))
                .rejects.toThrow("Product not available");
        });

        it("throws an error for a quantity of zero", async () => {
            await expect(addToCart(cart, mockProductDigital, 0))
                .rejects.toThrow("Quantity must be a positive integer");
        });

        it("throws an error for a negative quantity", async () => {
            await expect(addToCart(cart, mockProductDigital, -1))
                .rejects.toThrow("Quantity must be a positive integer");
        });

        it("throws an error if stock for a physical item is exceeded", async () => {
            await expect(addToCart(cart, mockProductPhysical, 11))
                .rejects.toThrow("Not enough stock");
        });

        it("throws an error if a physical product is out of stock", async () => {
            await expect(addToCart(cart, mockProductOutOfStock, 1))
                .rejects.toThrow("Not enough stock");
        });
    });

    describe("Update Cart Item: The happy path, when everything works", () => {
        beforeEach(async () => {
            await addToCart(cart, mockProductPhysical, 2);
        });

        it("updates the quantity of an item in the cart", async () => {
            const updatedCart = await updateItem(cart, mockProductPhysical.id, 5);
            expect(updatedCart.items[0].quantity).toBe(5);
        });

        it("recalculates the cart total after an update", async () => {
            const updatedCart = await updateItem(cart, mockProductPhysical.id, 5);
            expect(updatedCart.total).toBe(mockProductPhysical.price * 5);
        });
    });

    describe("Update Cart Item: The sad path, with error conditions", () => {
        beforeEach(async () => {
            await addToCart(cart, mockProductPhysical, 2);
        });
        
        it("throws an error when updating with a quantity of zero", async () => {
            await expect(updateItem(cart, mockProductPhysical.id, 0))
                .rejects.toThrow("Quantity must be a positive integer");
        });

        it("throws an error if the updated quantity exceeds stock", async () => {
            await expect(updateItem(cart, mockProductPhysical.id, 11))
                .rejects.toThrow("Not enough stock");
        });

        it("throws an error if the item to update is not in the cart", async () => {
            await expect(updateItem(cart, 999, 1))
                .rejects.toThrow("Item not found in cart");
        });
    });

    describe("Remove From Cart: The happy path, when everything works", () => {
        beforeEach(async () => {
            await addToCart(cart, mockProductDigital, 1);
            await addToCart(cart, mockProductPhysical, 2);
        });

        it("removes an item from the cart", async () => {
            const updatedCart = await removeFromCart(cart, mockProductDigital.id);
            expect(updatedCart.items.length).toBe(1);
        });

        it("recalculates the total after removing an item", async () => {
            const updatedCart = await removeFromCart(cart, mockProductDigital.id);
            expect(updatedCart.total).toBe(mockProductPhysical.price * 2);
        });
    });

    describe("Remove From Cart: The sad path, with error conditions", () => {
        it("throws an error if the item to remove is not in the cart", async () => {
            await expect(removeFromCart(cart, 999))
                .rejects.toThrow("Item not found in cart");
        });
    });

    describe("Clear Cart: The happy path, when everything works", () => {
        beforeEach(async () => {
            await addToCart(cart, mockProductDigital, 1);
            await addToCart(cart, mockProductPhysical, 2);
        });

        it("removes all items from the cart", async () => {
            const updatedCart = await clearCart(cart);
            expect(updatedCart.items.length).toBe(0);
        });
        
        it("resets the item count to zero", async () => {
            const updatedCart = await clearCart(cart);
            expect(updatedCart.item_count).toBe(0);
        });

        it("resets the total to zero", async () => {
            const updatedCart = await clearCart(cart);
            expect(updatedCart.total).toBe(0);
        });
    });
});