import { STORAGE } from '@/constants/common.const'

export const saveToLocalStorage = <T>(key: string, data: T): void => {
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error(STORAGE.LOCAL_STORAGE_ERROR_SAVING, error)
    }
  } else {
    console.warn(STORAGE.LOCAL_STORAGE_NOT_AVAILABLE)
  }
}

export const getFromLocalStorage = <T>(key: string): T | null => {
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    try {
      const dataString = localStorage.getItem(key)
      if (dataString) {
        return JSON.parse(dataString) as T
      } else {
        return null
      }
    } catch (error) {
      console.error(STORAGE.LOCAl_STORAGE_ERROR_GETTING, error)
      return null
    }
  } else {
    console.warn(STORAGE.LOCAL_STORAGE_NOT_AVAILABLE)
    return null
  }
}

export const removeFromLocalStorage = (key: string): void => {
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(STORAGE.LOCAl_STORAGE_ERROR_REMOVING, error)
    }
  } else {
    console.warn(STORAGE.LOCAL_STORAGE_NOT_AVAILABLE)
  }
}
