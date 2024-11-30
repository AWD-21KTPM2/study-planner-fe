import { STORAGE } from '@/constants/common.const'

export const saveToSessionStorage = <T>(key: string, data: T): void => {
  if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
    try {
      sessionStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error(STORAGE.SESSION_STORAGE_ERROR_SAVING, error)
    }
  } else {
    console.warn(STORAGE.SESSION_STORAGE_NOT_AVAILABLE)
  }
}

export const getFromSessionStorage = <T>(key: string): T | null => {
  if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
    try {
      const dataString = sessionStorage.getItem(key)
      if (dataString) {
        return JSON.parse(dataString) as T
      } else {
        return null
      }
    } catch (error) {
      console.error(STORAGE.SESSION_STORAGE_ERROR_GETTING, error)
      return null
    }
  } else {
    console.warn(STORAGE.SESSION_STORAGE_NOT_AVAILABLE)
    return null
  }
}

export const removeFromSessionStorage = (key: string): void => {
  if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
    try {
      sessionStorage.removeItem(key)
    } catch (error) {
      console.error(STORAGE.SESSION_STORAGE_ERROR_REMOVING, error)
    }
  } else {
    console.warn(STORAGE.SESSION_STORAGE_NOT_AVAILABLE)
  }
}

export const clearSessionStorage = (): void => {
  if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
    try {
      sessionStorage.clear()
    } catch (error) {
      console.error(STORAGE.SESSION_STORAGE_ERROR_CLEARING, error)
    }
  } else {
    console.warn(STORAGE.SESSION_STORAGE_NOT_AVAILABLE)
  }
}
