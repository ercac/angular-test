// ============================================================
// APP COMPONENT — The root "shell" of the application
// ============================================================
// ANGULAR CONCEPT: Component Composition
//
// This is the top-level component. It renders:
// 1. <app-navbar>      → Always visible (persistent navigation)
// 2. <router-outlet>   → Dynamic area where page components render
//
// When the user navigates to '/products', Angular swaps the
// content inside <router-outlet> to show ProductListComponent.
// The navbar stays visible on every page because it's OUTSIDE
// the router-outlet.
// ============================================================

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // In standalone components, you must explicitly list every
  // dependency (components, directives, pipes) in `imports`.
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ShopNG';
}
