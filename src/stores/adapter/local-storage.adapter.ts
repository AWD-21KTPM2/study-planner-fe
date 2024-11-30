import { PersistStorage, StorageValue } from 'zustand/middleware'

export const localStorageAdapter = <T>(): PersistStorage<T> => ({
  getItem: (name: string): StorageValue<T> | null => {
    const storedValue = localStorage.getItem(name)
    return storedValue ? JSON.parse(storedValue) : null
  },
  setItem: (name: string, value: StorageValue<T>): void => {
    localStorage.setItem(name, JSON.stringify(value))
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name)
  }
})
