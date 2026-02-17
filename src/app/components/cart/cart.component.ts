// ============================================================
// CART COMPONENT — Shopping cart page
// ============================================================
// ANGULAR CONCEPTS:
//
// 1. Reading Signals directly in templates
//    cartService.items(), cartService.totalPrice() etc.
//    No async pipe needed! Signals are automatically tracked.
//
// 2. Router.navigate() — Programmatic navigation
//    Used to redirect to checkout when "Proceed to Checkout"
//    is clicked.
// ============================================================

import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  // Public so the template can access it directly
  constructor(
    public cartService: CartService,
    private router: Router
  ) {}

  /**
   * Update the quantity of a cart item.
   * The CartService handles removal if quantity drops to 0.
   */
  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  /** Remove an item from the cart */
  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  /** Navigate to the checkout page */
  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
