// ============================================================
// PRODUCT CARD COMPONENT — Reusable card for displaying a product
// ============================================================
// ANGULAR CONCEPTS:
//
// 1. @Input() — Receives data from a PARENT component.
//    The parent passes a product like:
//      <app-product-card [product]="myProduct" />
//
// 2. @Output() + EventEmitter — Sends events TO the parent.
//    When the "Add to Cart" button is clicked, we emit an event:
//      <app-product-card (addedToCart)="handleAdd($event)" />
//
// 3. This is a "presentational" (or "dumb") component.
//    It doesn't fetch data or manage state — it just receives
//    data via @Input and communicates back via @Output.
//    This makes it highly reusable and easy to test!
// ============================================================

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../product.model';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  // Every external dependency must be imported explicitly
  imports: [RouterLink, CurrencyPipe, TruncatePipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  // ─── @Input: Data flowing IN from the parent ──────────────
  // The `!` (definite assignment assertion) tells TypeScript
  // "trust me, this will be set before it's used."
  @Input() product!: Product;

  // ─── @Output: Events flowing OUT to the parent ────────────
  // EventEmitter<Product> means this event carries a Product payload.
  @Output() addedToCart = new EventEmitter<Product>();

  /**
   * Called when "Add to Cart" button is clicked.
   * Emits the product to the parent component.
   */
  onAddToCart(): void {
    this.addedToCart.emit(this.product);
  }

  /**
   * Generate an array of star types for the rating display.
   * Returns 5 strings: 'full', 'half', or 'empty'.
   *
   * Example: rating 3.5 → ['full', 'full', 'full', 'half', 'empty']
   */
  getStars(rating: number): string[] {
    const stars: string[] = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push('full');
      } else if (rating >= i - 0.5) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
    }
    return stars;
  }
}
