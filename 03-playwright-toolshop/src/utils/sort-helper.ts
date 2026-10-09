/**
 * Reusable helper to validate whether an array of strings or numbers is sorted.
 * @param array - Array of numbers or strings to check
 * @param direction - 'asc' for ascending, 'desc' for descending
 */
export function isSorted<T extends number | string>(
  array: T[],
  direction: 'asc' | 'desc' = 'asc'
): boolean {
  if (array.length <= 1) return true;

  for (let i = 0; i < array.length - 1; i++) {
    const current = array[i];
    const next = array[i + 1];

    if (direction === 'asc') {
      if (typeof current === 'string' && typeof next === 'string') {
        if (current.localeCompare(next) > 0) return false;
      } else if (current > next) {
        return false;
      }
    } else {
      if (typeof current === 'string' && typeof next === 'string') {
        if (current.localeCompare(next) < 0) return false;
      } else if (current < next) {
        return false;
      }
    }
  }

  return true;
}
