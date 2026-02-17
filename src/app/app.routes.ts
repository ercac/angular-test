// ============================================================
// APP ROUTES — The URL-to-component mapping for the entire app
// ============================================================
// ANGULAR CONCEPT: Routing
//
// The Routes array tells Angular which component to display
// for each URL. When the user navigates to '/products', Angular
// renders ProductListComponent inside the <router-outlet>.
//
// Key patterns:
// - Static routes:    { path: 'products', component: ... }
// - Route parameters: { path: 'product/:id', component: ... }
//   The `:id` part is a dynamic segment — it matches any value
//   (e.g., /product/1, /product/42). The component can read it.
// - Wildcard route:   { path: '**', redirectTo: '' }
//   Catches any URL that doesn't match above routes and redirects.
//   MUST be the LAST route in the array!
// ============================================================

import { Routes } from '@angular/router';

// Import all page-level components
import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

export const routes: Routes = [
  // Home page — the default route (empty path)
  { path: '', component: HomeComponent },

  // Product listing page — shows all products with filtering
  { path: 'products', component: ProductListComponent },

  // Product detail page — `:id` is a route parameter
  // Example URL: /product/5 → id = 5
  { path: 'product/:id', component: ProductDetailComponent },

  // Shopping cart page
  { path: 'cart', component: CartComponent },

  // Checkout page — form for placing orders
  { path: 'checkout', component: CheckoutComponent },

  // Wildcard — catches all unknown URLs and redirects to home
  // IMPORTANT: This must always be the LAST route!
  { path: '**', redirectTo: '' }
];
