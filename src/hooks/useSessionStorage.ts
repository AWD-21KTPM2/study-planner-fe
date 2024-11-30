import { useState } from 'react'

import { getFromSessionStorage, removeFromSessionStorage, saveToSessionStorage } from '@/utils/session-storage.util'

export function useSessionStorage<T>(key: string, initialValue: T): [T, (value: T) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const value = getFromSessionStorage<T>(key)
      return value !== null && value !== undefined ? value : initialValue
    } catch (error) {
      console.warn(`Error reading sessionStorage key “${key}”:`, error)
      return initialValue
    }
  })

  const setValue = (value: T): void => {
    try {
      saveToSessionStorage<T>(key, value)
      setStoredValue(value)
    } catch (error) {
      console.warn(`Error setting sessionStorage key “${key}”:`, error)
    }
  }

  const removeValue = (): void => {
    try {
      removeFromSessionStorage(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`Error removing sessionStorage key “${key}”:`, error)
    }
  }

  return [storedValue, setValue, removeValue]
}
