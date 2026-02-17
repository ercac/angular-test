// ============================================================
// PRODUCT MODEL — The data shape for our entire application
// ============================================================
// ANGULAR CONCEPT: TypeScript interfaces
// Interfaces define the "shape" of data at compile-time.
// They don't exist at runtime — they're purely for type safety
// and editor autocompletion. Every component and service that
// deals with products will import and use these interfaces.
// ============================================================

/**
 * Represents a product in our store.
 * Every product in the mock data array must match this shape.
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;        // URL to product image (using picsum.photos)
  category: string;     // e.g., 'Electronics', 'Clothing', 'Books', 'Home'
  rating: number;       // Star rating from 1 to 5
  stock: number;        // How many are available
}

/**
 * Represents an item in the shopping cart.
 * It wraps a Product with a quantity — this lets us track
 * how many of each product the user wants to buy.
 */
export interface CartItem {
  product: Product;
  quantity: number;
}
