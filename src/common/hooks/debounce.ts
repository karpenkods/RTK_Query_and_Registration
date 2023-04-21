import { useEffect, useState } from 'react'

export function useDebounce(value: number, delay = 500): number {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handler)
  }, [delay, value])

  return debounced
}
