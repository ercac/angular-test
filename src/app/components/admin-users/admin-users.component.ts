// ============================================================
// ADMIN USERS COMPONENT — User account management
// ============================================================
// ANGULAR CONCEPTS:
//
// 1. Expandable user detail panel
//    Clicking a user row reveals their private info:
//    shipping address (from UserProfileService), order
//    history stats, and account status controls.
//    Payment info is deliberately hidden for privacy.
//
// 2. Role-based display
//    Admin accounts show a special badge. The current
//    admin's own account cannot be suspended (self-lock
//    protection).
//
// 3. Cross-service data
//    Combines UserService (account data) with
//    UserProfileService (profile/address data) to show
//    a complete picture without exposing payment fields.
// ============================================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminUser, UserProfile } from '../../product.model';
import { UserService } from '../../services/user.service';
import { UserProfileService } from '../../services/user-profile.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {

  users: AdminUser[] = [];
  filteredUsers: AdminUser[] = [];
  searchTerm = '';
  roleFilter = 'all';
  loading = true;
  error = '';
  expandedUserId: number | null = null;

  // Stats
  totalUsers = 0;
  activeUsers = 0;
  adminCount = 0;

  constructor(
    private userService: UserService,
    private userProfileService: UserProfileService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.computeStats();
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load users.';
        this.loading = false;
      }
    });
  }

  private computeStats(): void {
    this.totalUsers = this.users.length;
    this.activeUsers = this.users.filter(u => u.status === 'active').length;
    this.adminCount = this.users.filter(u => u.role === 'admin').length;
  }

  applyFilter(): void {
    let result = [...this.users];

    // Role filter
    if (this.roleFilter !== 'all') {
      result = result.filter(u => u.role === this.roleFilter);
    }

    // Search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(u =>
        u.email.toLowerCase().includes(term) ||
        u.firstName.toLowerCase().includes(term) ||
        u.lastName.toLowerCase().includes(term)
      );
    }

    this.filteredUsers = result;
  }

  toggleExpand(userId: number): void {
    this.expandedUserId = this.expandedUserId === userId ? null : userId;
  }

  toggleStatus(user: AdminUser): void {
    this.userService.toggleUserStatus(user.id).subscribe({
      next: (updated) => {
        const index = this.users.findIndex(u => u.id === updated.id);
        if (index !== -1) {
          this.users[index] = updated;
          this.computeStats();
          this.applyFilter();
        }
      },
      error: () => {
        this.error = 'Failed to update user status.';
      }
    });
  }

  /** Load a user's saved profile (address only — no payment) */
  getUserProfile(userId: number): UserProfile | null {
    const key = `user_profile_${userId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try { return JSON.parse(stored); }
      catch { return null; }
    }
    return null;
  }

  /** Check if the expanded user is the currently logged-in admin */
  isSelf(userId: number): boolean {
    const current = this.authService.currentUser();
    return current !== null && current.id === userId;
  }

  getStatusClass(status: string): string {
    return status === 'active' ? 'status-active' : 'status-suspended';
  }

  getRoleClass(role: string): string {
    return role === 'admin' ? 'role-admin' : 'role-user';
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }
}
