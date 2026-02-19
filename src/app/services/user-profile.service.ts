import { Injectable, signal, computed, effect } from '@angular/core';
import { AuthService } from './auth.service';
import { User, UserProfile } from '../product.model';

// ── Default profile for admin accounts ──────────────────────
// Pre-filled so admins can test checkout immediately.
const ADMIN_DEFAULT_PROFILE: Omit<UserProfile, 'userId'> = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@shopng.com',
  shippingAddress: '100 Commerce Blvd',
  shippingCity: 'San Francisco',
  shippingState: 'CA',
  shippingZip: '94102',
  cardName: 'Admin User',
  cardNumber: '4111111111111111',
  cardExpiry: '12/28',
  cardCvv: '999'
};

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private profileSignal = signal<UserProfile | null>(null);

  /** Current user profile (read-only) */
  readonly profile = computed(() => this.profileSignal());

  /** Whether a profile exists */
  readonly hasProfile = computed(() => this.profileSignal() !== null);

  constructor(private authService: AuthService) {
    // Automatically load/clear profile when auth state changes
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.loadProfile(user);
      } else {
        this.clearProfile();
      }
    });
  }

  // ── Load Profile ────────────────────────────────────────────
  // Reads from localStorage. If no saved profile exists and
  // the user is an admin, returns the preset admin defaults.
  private loadProfile(user: User): void {
    const key = `user_profile_${user.id}`;
    const stored = localStorage.getItem(key);

    if (stored) {
      try {
        this.profileSignal.set(JSON.parse(stored));
        return;
      } catch {
        localStorage.removeItem(key);
      }
    }

    // No saved profile — use admin defaults if admin
    if (user.role === 'admin') {
      const adminProfile: UserProfile = {
        ...ADMIN_DEFAULT_PROFILE,
        userId: user.id
      };
      this.profileSignal.set(adminProfile);
      // Save the defaults so they persist
      localStorage.setItem(key, JSON.stringify(adminProfile));
    } else {
      // Regular user with no saved profile — start with null
      this.profileSignal.set(null);
    }
  }

  // ── Save Profile ────────────────────────────────────────────
  // Called from the settings page when the user saves.
  saveProfile(profile: UserProfile): void {
    const key = `user_profile_${profile.userId}`;
    this.profileSignal.set(profile);
    localStorage.setItem(key, JSON.stringify(profile));
  }

  // ── Clear Profile ───────────────────────────────────────────
  // Resets in-memory state on logout. localStorage is kept
  // intact so the profile loads again on next login.
  private clearProfile(): void {
    this.profileSignal.set(null);
  }
}
