import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
    const [value, setValue] = useState<T>(() => {
        try {
            const jsonValue = localStorage.getItem(key);
            if (jsonValue != null) return JSON.parse(jsonValue);
        } catch (error) {
            console.error(`Error reading localStorage key “${key}”:`, error);
        }

        if (typeof initialValue === 'function') {
            return (initialValue as () => T)();
        } else {
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”:`, error);
        }
    }, [key, value]);

    return [value, setValue] as const;
}