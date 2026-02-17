// ============================================================
// CART SERVICE — Reactive state management with Angular Signals
// ============================================================
// ANGULAR CONCEPTS:
//
// 1. Signals (Angular 16+)
//    Signals are a new reactive primitive in Angular. Think of
//    them as "smart variables" that Angular automatically tracks.
//    When a signal's value changes, any component reading it
//    in its template will re-render automatically.
//
// 2. signal() — Creates a writable signal (you can set/update it)
// 3. computed() — Creates a read-only signal derived from others.
//    It recalculates only when its dependencies change.
//
// 4. Why Signals over BehaviorSubject?
//    - Simpler API (no .subscribe(), no .pipe())
//    - Automatic dependency tracking
//    - Better performance with fine-grained change detection
//    - Read them in templates with just `mySignal()` — no async pipe!
// ============================================================

import { Injectable, signal, computed } from '@angular/core';
import { Product, CartItem } from '../product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // ─── PRIVATE STATE ───────────────────────────────────────────
  // Only this service can modify the cart. Components can only
  // READ from the computed signals below.
  // ──────────────────────────────────────────────────────────────

  private cartItems = signal<CartItem[]>([]);

  // ─── PUBLIC COMPUTED SIGNALS ─────────────────────────────────
  // These are read-only. Components use them in templates like:
  //   {{ cartService.itemCount() }}
  // Angular tracks which signals each template reads and only
  // re-renders when those specific signals change.
  // ──────────────────────────────────────────────────────────────

  /** All items currently in the cart */
  readonly items = computed(() => this.cartItems());

  /** Total number of items (summing quantities) */
  readonly itemCount = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );

  /** Total price of all items in the cart */
  readonly totalPrice = computed(() =>
    this.cartItems().reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    )
  );

  // ─── PUBLIC METHODS ──────────────────────────────────────────

  /**
   * Add a product to the cart.
   * If the product is already in the cart, increase its quantity.
   * Otherwise, add it as a new cart item.
   */
  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems();

    // Check if product is already in cart
    const existingIndex = currentItems.findIndex(
      item => item.product.id === product.id
    );

    if (existingIndex > -1) {
      // Product exists — update quantity (immutable update)
      // We create a NEW array so Angular's signal detects the change
      const updatedItems = currentItems.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      this.cartItems.set(updatedItems);
    } else {
      // New product — add to cart
      this.cartItems.set([...currentItems, { product, quantity }]);
    }
  }

  /**
   * Remove a product from the cart entirely.
   */
  removeFromCart(productId: number): void {
    this.cartItems.set(
      this.cartItems().filter(item => item.product.id !== productId)
    );
  }

  /**
   * Update the quantity of a specific cart item.
   * If quantity drops to 0 or below, remove the item.
   */
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.cartItems.set(
      this.cartItems().map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }

  /**
   * Empty the entire cart (used after checkout).
   */
  clearCart(): void {
    this.cartItems.set([]);
  }
}
