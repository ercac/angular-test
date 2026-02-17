// ============================================================
// PRODUCT SERVICE — The "single source of truth" for product data
// ============================================================
// ANGULAR CONCEPTS:
//
// 1. @Injectable({ providedIn: 'root' })
//    This tells Angular to create ONE instance of this service
//    and share it across the entire app (singleton pattern).
//    Any component can "inject" it via the constructor.
//
// 2. Observables (RxJS)
//    Even though our data is hardcoded, we return Observables
//    using `of()`. This mimics how real HTTP calls work with
//    Angular's HttpClient, so when you replace mock data with
//    a real API later, your components won't need to change!
// ============================================================

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // ─── MOCK PRODUCT DATA ─────────────────────────────────────
  // In a real app, this would come from an API via HttpClient.
  // We use picsum.photos for realistic placeholder images.
  // ────────────────────────────────────────────────────────────

  private products: Product[] = [
    // ── ELECTRONICS ──────────────────────────────────────────
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality. Perfect for music lovers and remote workers who want to block out distractions.',
      price: 79.99,
      image: 'https://picsum.photos/seed/headphones/400/400',
      category: 'Electronics',
      rating: 4.5,
      stock: 15
    },
    {
      id: 2,
      name: 'Smart Watch Pro',
      description: 'Feature-packed smartwatch with heart rate monitoring, GPS tracking, sleep analysis, and a stunning AMOLED display. Water-resistant up to 50 meters with 7-day battery life.',
      price: 199.99,
      image: 'https://picsum.photos/seed/smartwatch/400/400',
      category: 'Electronics',
      rating: 4.2,
      stock: 8
    },
    {
      id: 3,
      name: 'Portable Bluetooth Speaker',
      description: 'Compact and powerful wireless speaker with 360-degree sound, IPX7 waterproofing, and 12-hour playback. Take your music anywhere — from the beach to the mountains.',
      price: 49.99,
      image: 'https://picsum.photos/seed/speaker/400/400',
      category: 'Electronics',
      rating: 4.0,
      stock: 22
    },

    // ── CLOTHING ─────────────────────────────────────────────
    {
      id: 4,
      name: 'Classic Denim Jacket',
      description: 'Timeless denim jacket crafted from premium cotton. Features a comfortable regular fit, button closure, and multiple pockets. A wardrobe essential that goes with everything.',
      price: 89.99,
      image: 'https://picsum.photos/seed/denim-jacket/400/400',
      category: 'Clothing',
      rating: 4.7,
      stock: 12
    },
    {
      id: 5,
      name: 'Running Sneakers Ultra',
      description: 'Lightweight performance running shoes with responsive cushioning and breathable mesh upper. Engineered for comfort on long runs with superior arch support.',
      price: 129.99,
      image: 'https://picsum.photos/seed/sneakers/400/400',
      category: 'Clothing',
      rating: 4.6,
      stock: 18
    },
    {
      id: 6,
      name: 'Wool Blend Overcoat',
      description: 'Elegant wool blend overcoat perfect for cooler weather. Tailored silhouette with notch lapels, two-button closure, and fully lined interior for warmth and comfort.',
      price: 159.99,
      image: 'https://picsum.photos/seed/overcoat/400/400',
      category: 'Clothing',
      rating: 4.3,
      stock: 5
    },

    // ── BOOKS ────────────────────────────────────────────────
    {
      id: 7,
      name: 'The Art of Clean Code',
      description: 'A comprehensive guide to writing maintainable, readable, and efficient code. Covers best practices, design patterns, refactoring techniques, and real-world examples from industry experts.',
      price: 34.99,
      image: 'https://picsum.photos/seed/coding-book/400/400',
      category: 'Books',
      rating: 4.8,
      stock: 30
    },
    {
      id: 8,
      name: 'Modern JavaScript Deep Dive',
      description: 'Master JavaScript from fundamentals to advanced concepts. Covers ES6+, async programming, closures, prototypes, modules, and practical patterns used in modern web development.',
      price: 44.99,
      image: 'https://picsum.photos/seed/js-book/400/400',
      category: 'Books',
      rating: 4.9,
      stock: 25
    },
    {
      id: 9,
      name: 'Design Patterns Handbook',
      description: 'Learn the 23 classic design patterns with modern examples in TypeScript and JavaScript. Includes creational, structural, and behavioral patterns with UML diagrams and code samples.',
      price: 39.99,
      image: 'https://picsum.photos/seed/patterns-book/400/400',
      category: 'Books',
      rating: 4.4,
      stock: 20
    },

    // ── HOME & GARDEN ────────────────────────────────────────
    {
      id: 10,
      name: 'Ceramic Plant Pot Set',
      description: 'Set of 3 minimalist ceramic pots in varying sizes. Features drainage holes and matching saucers. Matte finish in neutral tones that complement any interior decor style.',
      price: 29.99,
      image: 'https://picsum.photos/seed/plant-pots/400/400',
      category: 'Home',
      rating: 4.1,
      stock: 35
    },
    {
      id: 11,
      name: 'LED Desk Lamp',
      description: 'Adjustable LED desk lamp with 5 brightness levels and 3 color temperatures. Features a USB charging port, touch controls, and a flexible gooseneck for perfect positioning.',
      price: 54.99,
      image: 'https://picsum.photos/seed/desk-lamp/400/400',
      category: 'Home',
      rating: 4.3,
      stock: 14
    },
    {
      id: 12,
      name: 'Scented Candle Collection',
      description: 'Luxury soy wax candle set with 4 seasonal fragrances: lavender, vanilla, cedarwood, and ocean breeze. Each candle provides up to 45 hours of clean, even burn time.',
      price: 24.99,
      image: 'https://picsum.photos/seed/candles/400/400',
      category: 'Home',
      rating: 4.6,
      stock: 40
    }
  ];

  constructor() { }

  // ─── PUBLIC METHODS ──────────────────────────────────────────
  // Each method returns an Observable<...> to mimic real API calls.
  // `of()` creates an Observable that immediately emits the value.
  // ──────────────────────────────────────────────────────────────

  /** Get all products */
  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  /** Get a single product by its ID */
  getProductById(id: number): Observable<Product | undefined> {
    // Array.find() returns the first match or undefined
    return of(this.products.find(p => p.id === id));
  }

  /** Get all products in a specific category */
  getProductsByCategory(category: string): Observable<Product[]> {
    return of(
      this.products.filter(p =>
        p.category.toLowerCase() === category.toLowerCase()
      )
    );
  }

  /**
   * Search products by name or description.
   * Uses case-insensitive partial matching.
   */
  searchProducts(term: string): Observable<Product[]> {
    const lowerTerm = term.toLowerCase();
    return of(
      this.products.filter(p =>
        p.name.toLowerCase().includes(lowerTerm) ||
        p.description.toLowerCase().includes(lowerTerm)
      )
    );
  }

  /**
   * Get unique category names from all products.
   * Returns a plain string array (not Observable) since
   * categories are derived from the static product list.
   */
  getCategories(): string[] {
    // new Set() removes duplicates, spread converts back to array
    return [...new Set(this.products.map(p => p.category))];
  }

  /** Get featured products (hand-picked for the home page) */
  getFeaturedProducts(): Observable<Product[]> {
    // Pick 4 highly-rated products from different categories
    return of(
      this.products
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4)
    );
  }
}
