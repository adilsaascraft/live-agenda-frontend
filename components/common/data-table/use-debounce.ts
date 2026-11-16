import { useEffect, useState } from 'react'

/**
 * Delays updating a value until after the specified delay.
 *
 * Useful for:
 * - Search inputs
 * - Server-side filtering
 * - API requests
 * - Expensive computations
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      window.clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
