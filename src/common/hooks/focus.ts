import { useEffect, useRef } from 'react'

export function useFocus(showInput: boolean) {
  const refFocus = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (showInput) refFocus?.current?.focus()
  }, [showInput])

  return refFocus
}
