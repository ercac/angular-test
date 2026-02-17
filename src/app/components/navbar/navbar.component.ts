// ============================================================
// NAVBAR COMPONENT — Persistent navigation bar
// ============================================================
// ANGULAR CONCEPTS:
//
// 1. RouterLink — Directive for navigation links (replaces <a href>)
//    Unlike <a href>, RouterLink doesn't reload the page!
//
// 2. RouterLinkActive — Adds a CSS class to the active link.
//    e.g., when on /products, the "Products" link gets 'active' class.
//
// 3. FormsModule — Required for [(ngModel)] two-way binding.
//    In standalone components, you must import it explicitly.
//
// 4. Reading Signals in templates — cartService.itemCount()
//    Angular automatically tracks signal reads and re-renders
//    only when that signal's value changes.
// ============================================================

import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  // Two-way bound to the search input via [(ngModel)]
  searchTerm: string = '';

  // Track mobile menu state
  mobileMenuOpen: boolean = false;

  // Inject services via constructor
  // `public` so we can access cartService directly in the template
  constructor(
    public cartService: CartService,
    private router: Router
  ) {}

  /**
   * Navigate to products page with search query parameter.
   * Called when the user submits the search form.
   */
  onSearch(): void {
    if (this.searchTerm.trim()) {
      // Router.navigate() changes the URL programmatically
      // queryParams adds ?search=term to the URL
      this.router.navigate(['/products'], {
        queryParams: { search: this.searchTerm.trim() }
      });
    } else {
      this.router.navigate(['/products']);
    }
    this.mobileMenuOpen = false;
  }

  /** Toggle mobile hamburger menu */
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}
