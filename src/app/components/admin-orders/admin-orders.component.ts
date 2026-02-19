// ============================================================
// ADMIN ORDERS COMPONENT — Order lookup & management
// ============================================================
// ANGULAR CONCEPTS:
//
// 1. Search / lookup pattern
//    A search input filters orders by order number, customer
//    name, email, or status in real-time.
//
// 2. Expandable detail rows
//    Clicking an order row toggles an expanded view showing
//    the line items, cost breakdown, and status controls.
//
// 3. Status workflow
//    Admins can advance an order through the status pipeline:
//    pending → processing → shipped → delivered.
//    Cancelled orders are frozen.
// ============================================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order } from '../../product.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  searchTerm = '';
  statusFilter = 'all';
  loading = true;
  error = '';
  expandedOrderId: number | null = null;

  // Stats
  totalOrders = 0;
  totalRevenue = 0;
  pendingCount = 0;
  shippedCount = 0;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.computeStats();
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load orders.';
        this.loading = false;
      }
    });
  }

  private computeStats(): void {
    this.totalOrders = this.orders.length;
    this.totalRevenue = this.orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);
    this.pendingCount = this.orders.filter(o => o.status === 'pending').length;
    this.shippedCount = this.orders.filter(o => o.status === 'shipped').length;
  }

  applyFilter(): void {
    let result = [...this.orders];

    // Status filter
    if (this.statusFilter !== 'all') {
      result = result.filter(o => o.status === this.statusFilter);
    }

    // Search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(o =>
        o.orderNumber.toLowerCase().includes(term) ||
        (o.email && o.email.toLowerCase().includes(term)) ||
        (o.first_name && o.first_name.toLowerCase().includes(term)) ||
        (o.last_name && o.last_name.toLowerCase().includes(term))
      );
    }

    this.filteredOrders = result;
  }

  toggleExpand(orderId: number): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  updateStatus(order: Order, newStatus: Order['status']): void {
    this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
      next: (updated) => {
        const index = this.orders.findIndex(o => o.id === updated.id);
        if (index !== -1) {
          this.orders[index] = { ...this.orders[index], status: updated.status };
          this.computeStats();
          this.applyFilter();
        }
      },
      error: () => {
        this.error = 'Failed to update order status.';
      }
    });
  }

  /** Get the next logical status for the workflow buttons */
  getNextStatuses(current: Order['status']): Order['status'][] {
    const workflow: Record<string, Order['status'][]> = {
      'pending': ['processing', 'cancelled'],
      'processing': ['shipped', 'cancelled'],
      'shipped': ['delivered'],
      'delivered': [],
      'cancelled': []
    };
    return workflow[current] || [];
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'pending': 'status-pending',
      'processing': 'status-processing',
      'shipped': 'status-shipped',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled'
    };
    return map[status] || '';
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}
