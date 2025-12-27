
import { v4 as uuid } from "uuid";

// Mocking the services and models since they don't exist yet.
// We are imagining a CartService that handles the business logic.

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


// A mock service layer
const CartService = {
  // Simulates creating a new cart
  createCart: (customerId = null) => ({
    id: uuid(),
    customer_id: customerId,
    total: 0,
    item_count: 0,
    items: [],
    created_at: new Date(),
    updated_at: new Date(),
    expires_at: null,
  }),

  // Simulates adding an item
  addToCart: (cart, product, quantity) => {
    if (!product.isAvailable()) {
      throw new Error("Product not available");
    }
    if (quantity <= 0) {
        throw new Error("Quantity must be a positive integer");
    }
    if (!product.hasStock(quantity)) {
        throw new Error("Not enough stock");
    }

    const existingItem = cart.items.find(item => item.product_id === product.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            id: uuid(),
            cart_id: cart.id,
            product_id: product.id,
            quantity: quantity,
            price: product.price, // Snapshot price
            created_at: new Date(),
            updated_at: new Date(),
        });
    }
    
    // Recalculate totals
    cart.item_count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.updated_at = new Date();
    
    return cart;
  },

  updateItem: (cart, productId, newQuantity) => {
    if (newQuantity <= 0) {
        throw new Error("Quantity must be a positive integer");
    }
    const item = cart.items.find(i => i.product_id === productId);
    if (!item) {
        throw new Error("Item not found in cart");
    }
    const product = [mockProductDigital, mockProductPhysical, mockProductOutOfStock].find(p => p.id === productId);

    if (!product.hasStock(newQuantity)) {
        throw new Error("Not enough stock");
    }

    item.quantity = newQuantity;
    item.updated_at = new Date();

    // Recalculate totals
    cart.item_count = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    cart.total = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    cart.updated_at = new Date();

    return cart;
  },

  removeFromCart: (cart, productId) => {
    const itemIndex = cart.items.findIndex(i => i.product_id === productId);
    if (itemIndex === -1) {
        throw new Error("Item not found in cart");
    }
    cart.items.splice(itemIndex, 1);

    // Recalculate totals
    cart.item_count = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    cart.total = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    cart.updated_at = new Date();
    
    return cart;
  },

  clearCart: (cart) => {
    cart.items = [];
    cart.item_count = 0;
    cart.total = 0;
    cart.updated_at = new Date();
    return cart;
  }
};


describe("Shopping Cart Business Logic", () => {
    let cart;

    beforeEach(() => {
        cart = CartService.createCart();
    });

    describe("Add to Cart: The happy path, when everything works", () => {
        it("adds a digital product to an empty cart", () => {
            const updatedCart = CartService.addToCart(cart, mockProductDigital, 1);
            expect(updatedCart.items.length).toBe(1);
        });

        it("sets the correct item count when a new item is added", () => {
            const updatedCart = CartService.addToCart(cart, mockProductDigital, 1);
            expect(updatedCart.item_count).toBe(1);
        });

        it("sets the correct total when a new item is added", () => {
            const updatedCart = CartService.addToCart(cart, mockProductDigital, 1);
            expect(updatedCart.total).toBe(1500);
        });

        it("adds a physical product to an empty cart", () => {
            const updatedCart = CartService.addToCart(cart, mockProductPhysical, 1);
            expect(updatedCart.items.length).toBe(1);
        });

        it("updates the quantity if the same product is added again", () => {
            CartService.addToCart(cart, mockProductDigital, 1);
            const updatedCart = CartService.addToCart(cart, mockProductDigital, 2);
            expect(updatedCart.items[0].quantity).toBe(3);
        });

        it("recalculates the total when adding more of the same item", () => {
            CartService.addToCart(cart, mockProductDigital, 1);
            const updatedCart = CartService.addToCart(cart, mockProductDigital, 2);
            expect(updatedCart.total).toBe(1500 * 3);
        });

        it("takes a snapshot of the price at the time of adding", () => {
            const updatedCart = CartService.addToCart(cart, mockProductDigital, 1);
            expect(updatedCart.items[0].price).toBe(mockProductDigital.price);
        });
    });

    describe("Add to Cart: The sad path, with error conditions", () => {
        it("throws an error if the product is not available", () => {
            expect(() => {
                CartService.addToCart(cart, mockProductNotAvailable, 1);
            }).toThrow("Product not available");
        });

        it("throws an error for a quantity of zero", () => {
            expect(() => {
                CartService.addToCart(cart, mockProductDigital, 0);
            }).toThrow("Quantity must be a positive integer");
        });

        it("throws an error for a negative quantity", () => {
            expect(() => {
                CartService.addToCart(cart, mockProductDigital, -1);
            }).toThrow("Quantity must be a positive integer");
        });

        it("throws an error if stock for a physical item is exceeded", () => {
            expect(() => {
                CartService.addToCart(cart, mockProductPhysical, 11);
            }).toThrow("Not enough stock");
        });

        it("throws an error if a physical product is out of stock", () => {
            expect(() => {
                CartService.addToCart(cart, mockProductOutOfStock, 1);
            }).toThrow("Not enough stock");
        });
    });

    describe("Update Cart Item: The happy path, when everything works", () => {
        beforeEach(() => {
            CartService.addToCart(cart, mockProductPhysical, 2);
        });

        it("updates the quantity of an item in the cart", () => {
            const updatedCart = CartService.updateItem(cart, mockProductPhysical.id, 5);
            expect(updatedCart.items[0].quantity).toBe(5);
        });

        it("recalculates the cart total after an update", () => {
            const updatedCart = CartService.updateItem(cart, mockProductPhysical.id, 5);
            expect(updatedCart.total).toBe(mockProductPhysical.price * 5);
        });
    });

    describe("Update Cart Item: The sad path, with error conditions", () => {
        beforeEach(() => {
            CartService.addToCart(cart, mockProductPhysical, 2);
        });
        
        it("throws an error when updating with a quantity of zero", () => {
            expect(() => {
                CartService.updateItem(cart, mockProductPhysical.id, 0);
            }).toThrow("Quantity must be a positive integer");
        });

        it("throws an error if the updated quantity exceeds stock", () => {
            expect(() => {
                CartService.updateItem(cart, mockProductPhysical.id, 11);
            }).toThrow("Not enough stock");
        });

        it("throws an error if the item to update is not in the cart", () => {
            expect(() => {
                CartService.updateItem(cart, 999, 1);
            }).toThrow("Item not found in cart");
        });
    });

    describe("Remove From Cart: The happy path, when everything works", () => {
        beforeEach(() => {
            CartService.addToCart(cart, mockProductDigital, 1);
            CartService.addToCart(cart, mockProductPhysical, 2);
        });

        it("removes an item from the cart", () => {
            const updatedCart = CartService.removeFromCart(cart, mockProductDigital.id);
            expect(updatedCart.items.length).toBe(1);
        });

        it("recalculates the total after removing an item", () => {
            const updatedCart = CartService.removeFromCart(cart, mockProductDigital.id);
            expect(updatedCart.total).toBe(mockProductPhysical.price * 2);
        });
    });

    describe("Remove From Cart: The sad path, with error conditions", () => {
        it("throws an error if the item to remove is not in the cart", () => {
            expect(() => {
                CartService.removeFromCart(cart, 999);
            }).toThrow("Item not found in cart");
        });
    });

    describe("Clear Cart: The happy path, when everything works", () => {
        beforeEach(() => {
            CartService.addToCart(cart, mockProductDigital, 1);
            CartService.addToCart(cart, mockProductPhysical, 2);
        });

        it("removes all items from the cart", () => {
            const updatedCart = CartService.clearCart(cart);
            expect(updatedCart.items.length).toBe(0);
        });
        
        it("resets the item count to zero", () => {
            const updatedCart = CartService.clearCart(cart);
            expect(updatedCart.item_count).toBe(0);
        });

        it("resets the total to zero", () => {
            const updatedCart = CartService.clearCart(cart);
            expect(updatedCart.total).toBe(0);
        });
    });
});
