// ============================================================
// TRUNCATE PIPE — A custom pipe to shorten long text
// ============================================================
// ANGULAR CONCEPT: Custom Pipes
//
// Pipes transform data in templates. Angular has built-in pipes
// like `currency`, `date`, `uppercase`. But you can create your own!
//
// Usage in a template:
//   {{ product.description | truncate }}         → defaults to 100 chars
//   {{ product.description | truncate:50 }}      → limit to 50 chars
//   {{ product.description | truncate:80:'---' }} → custom trail
//
// Pipes are "pure" by default — Angular only re-runs them when
// the input value changes (not on every change detection cycle).
// ============================================================

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {

  /**
   * Truncates a string to the specified limit.
   * @param value - The string to truncate
   * @param limit - Maximum character count (default: 100)
   * @param trail - What to append when truncated (default: '...')
   * @returns The truncated (or original) string
   */
  transform(value: string, limit: number = 100, trail: string = '...'): string {
    if (!value) return '';
    return value.length > limit
      ? value.substring(0, limit) + trail
      : value;
  }
}
