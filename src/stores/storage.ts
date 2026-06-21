import { createMMKV } from 'react-native-mmkv';
import type { MMKV } from 'react-native-mmkv';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage: MMKV = createMMKV({ id: 'waseem-scores' });

const MIGRATED_KEY = '__mmkv_migrated';

/**
 * Migrate data from AsyncStorage to MMKV (one-time).
 * Call this once at app startup before reading any data.
 */
export const migrateFromAsyncStorage = async (): Promise<void> => {
    if (storage.getBoolean(MIGRATED_KEY)) return;

    const keys = await AsyncStorage.getAllKeys();
    if (keys.length === 0) {
        storage.set(MIGRATED_KEY, true);
        return;
    }

    const entries = await AsyncStorage.multiGet(keys);
    for (const [key, value] of entries) {
        if (key && value != null) {
            storage.set(key, value);
        }
    }

    storage.set(MIGRATED_KEY, true);
};

// Helper functions matching AsyncStorage-like API
export const mmkvStorage = {
    getString: (key: string): string | undefined => storage.getString(key),

    setString: (key: string, value: string): void => storage.set(key, value),

    getObject: <T>(key: string): T | undefined => {
        const raw = storage.getString(key);
        if (!raw) return undefined;
        try {
            return JSON.parse(raw) as T;
        } catch {
            return undefined;
        }
    },

    setObject: (key: string, value: unknown): void => {
        storage.set(key, JSON.stringify(value));
    },

    getBoolean: (key: string): boolean => storage.getBoolean(key) ?? false,

    setBoolean: (key: string, value: boolean): void => storage.set(key, value),

    remove: (key: string): void => { storage.remove(key); },
};
