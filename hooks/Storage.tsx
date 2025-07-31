import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook for AsyncStorage that mimics localStorage behavior
 * Replaces useLocalStorage for React Native apps
 */
export function useAsyncStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load value from AsyncStorage on mount
  useEffect(() => {
    const loadValue = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const item = await AsyncStorage.getItem(key);
        
        if (item !== null) {
          const parsedValue = JSON.parse(item);
          setStoredValue(parsedValue);
        }
      } catch (err) {
        console.error(`Error loading ${key} from AsyncStorage:`, err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    loadValue();
  }, [key]); // Only depend on key

  // Function to update value
  const setValue = useCallback(async (value: T | ((prevValue: T) => T)) => {
    try {
      setError(null);
      
      // Use functional update to avoid dependency on storedValue
      setStoredValue(prevValue => {
        const valueToStore = typeof value === 'function' 
          ? (value as (prevValue: T) => T)(prevValue) 
          : value;
        
        // Save to AsyncStorage asynchronously
        AsyncStorage.setItem(key, JSON.stringify(valueToStore)).catch(err => {
          console.error(`Error saving ${key} to AsyncStorage:`, err);
          setError(err instanceof Error ? err.message : 'Unknown error');
        });
        
        return valueToStore;
      });
    } catch (err) {
      console.error(`Error saving ${key} to AsyncStorage:`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [key]);

  // Function to remove value
  const removeValue = useCallback(async () => {
    try {
      setError(null);
      await AsyncStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (err) {
      console.error(`Error removing ${key} from AsyncStorage:`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [key]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    isLoading,
    error
  };
}

/**
 * Utility functions for direct AsyncStorage operations
 */
export const storageUtils = {
  // Store data
  setItem: async function<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
      throw error;
    }
  },

  // Get data
  getItem: async function<T>(key: string): Promise<T | null> {
    try {
      const item = await AsyncStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  },

  // Remove data
  removeItem: async function(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  },

  // Clear all data
  clear: async function(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      throw error;
    }
  },

  // Get all keys
  getAllKeys: async function(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }
};

// Type definitions for the attendance tracker app
export type Course = {
  id: string;
  name: string;
  code: string;
  instructor: string;
  createdAt: string;
};

export type AttendanceRecord = {
  id: string;
  courseId: string;
  date: string;
  status: "present" | "absent";
};

// Storage keys constants
export const STORAGE_KEYS = {
  COURSES: 'courses',
  ATTENDANCE_RECORDS: 'attendanceRecords',
  THEME: 'darkMode',
  APP_SETTINGS: 'appSettings'
} as const;