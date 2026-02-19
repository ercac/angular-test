// ============================================================
// USER SERVICE — In-memory user management for admin panel
// ============================================================
// ANGULAR CONCEPTS:
//
// 1. Seed data that references order data
//    AdminUser has orderCount and totalSpent, computed from
//    the OrderService seed data so numbers are consistent.
//
// 2. Status toggling
//    Admins can suspend or reactivate user accounts.
//    This demonstrates in-memory state mutation returned
//    as Observables.
//
// 3. Privacy by design
//    The service deliberately EXCLUDES payment information.
//    Admins can see name, email, role, status, and order
//    history — but never card numbers or CVVs.
// ============================================================

import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { AdminUser } from '../product.model';

const SEED_USERS: AdminUser[] = [
  {
    id: 999,
    email: 'admin@shopng.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    status: 'active',
    registeredAt: '2025-06-01T08:00:00Z',
    orderCount: 0,
    totalSpent: 0
  },
  {
    id: 998,
    email: 'user@shopng.com',
    firstName: 'Demo',
    lastName: 'User',
    role: 'user',
    status: 'active',
    registeredAt: '2025-09-15T12:30:00Z',
    orderCount: 2,
    totalSpent: 334.93       // ORD-10001 + ORD-10005 (cancelled so adjusted later)
  },
  {
    id: 100,
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'user',
    status: 'active',
    registeredAt: '2025-11-02T09:15:00Z',
    orderCount: 1,
    totalSpent: 221.48
  },
  {
    id: 101,
    email: 'mark.johnson@example.com',
    firstName: 'Mark',
    lastName: 'Johnson',
    role: 'user',
    status: 'active',
    registeredAt: '2025-12-10T17:45:00Z',
    orderCount: 1,
    totalSpent: 134.86
  },
  {
    id: 102,
    email: 'sarah.williams@example.com',
    firstName: 'Sarah',
    lastName: 'Williams',
    role: 'user',
    status: 'active',
    registeredAt: '2026-01-05T14:20:00Z',
    orderCount: 1,
    totalSpent: 242.97
  }
];

@Injectable({ providedIn: 'root' })
export class UserService {

  private users: AdminUser[] = SEED_USERS.map(u => ({ ...u }));

  // ── Read ──────────────────────────────────────────────────

  /** Get all users (admin) */
  getAllUsers(): Observable<AdminUser[]> {
    return of([...this.users].sort((a, b) =>
      new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
    ));
  }

  /** Get a single user by ID */
  getUserById(id: number): Observable<AdminUser> {
    const user = this.users.find(u => u.id === id);
    if (!user) return throwError(() => ({ status: 404, error: 'User not found' }));
    return of({ ...user });
  }

  /** Search users by name or email */
  searchUsers(term: string): Observable<AdminUser[]> {
    const lower = term.toLowerCase();
    const results = this.users.filter(u =>
      u.email.toLowerCase().includes(lower) ||
      u.firstName.toLowerCase().includes(lower) ||
      u.lastName.toLowerCase().includes(lower) ||
      u.role.toLowerCase().includes(lower) ||
      u.status.toLowerCase().includes(lower)
    );
    return of(results);
  }

  // ── Update ────────────────────────────────────────────────

  /** Toggle user account status (active ↔ suspended) */
  toggleUserStatus(id: number): Observable<AdminUser> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return throwError(() => ({ status: 404, error: 'User not found' }));
    this.users[index].status = this.users[index].status === 'active' ? 'suspended' : 'active';
    return of({ ...this.users[index] });
  }

  // ── Aggregations (for dashboard) ──────────────────────────

  getUserCount(): number {
    return this.users.length;
  }

  getActiveUserCount(): number {
    return this.users.filter(u => u.status === 'active').length;
  }
}
