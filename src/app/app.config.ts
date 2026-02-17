// ============================================================
// APP CONFIG — Application-wide providers and configuration
// ============================================================
// ANGULAR CONCEPT: ApplicationConfig
//
// In standalone Angular apps (no NgModules), this is where you
// register application-wide providers. Common providers:
// - provideRouter()     → Enables routing (URL navigation)
// - provideHttpClient() → Enables HTTP calls (for future API use)
// ============================================================

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // provideHttpClient() sets up Angular's HttpClient.
    // We include it now even though we use mock data — this way,
    // when you're ready to connect to a real backend API, you
    // just inject HttpClient in your service. No config changes needed!
    provideHttpClient()
  ]
};
