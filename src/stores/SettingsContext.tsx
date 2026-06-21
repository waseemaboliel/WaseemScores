import React, { createContext, useContext, useState, useCallback } from 'react';
import { mmkvStorage } from './storage';

const SETTINGS_KEY = '@settings';
const ONBOARDING_KEY = '@onboarding_complete';

export interface AppSettings {
    timeFormat: '12h' | '24h';
    spoilerMode: boolean;
    notificationsEnabled: boolean;
    goalAlerts: boolean;
    matchStartAlerts: boolean;
}

const defaultSettings: AppSettings = {
    timeFormat: '12h',
    spoilerMode: false,
    notificationsEnabled: true,
    goalAlerts: true,
    matchStartAlerts: false,
};

interface SettingsContextType {
    settings: AppSettings;
    updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
    onboardingComplete: boolean;
    completeOnboarding: () => void;
}

const SettingsContext = createContext<SettingsContextType>({
    settings: defaultSettings,
    updateSetting: () => { },
    onboardingComplete: false,
    completeOnboarding: () => { },
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<AppSettings>(() => {
        const saved = mmkvStorage.getObject<AppSettings>(SETTINGS_KEY);
        return saved ? { ...defaultSettings, ...saved } : defaultSettings;
    });
    const [onboardingComplete, setOnboardingComplete] = useState(() => {
        return mmkvStorage.getBoolean(ONBOARDING_KEY);
    });

    const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        setSettings((prev) => {
            const next = { ...prev, [key]: value };
            mmkvStorage.setObject(SETTINGS_KEY, next);
            return next;
        });
    }, []);

    const completeOnboarding = useCallback(() => {
        setOnboardingComplete(true);
        mmkvStorage.setBoolean(ONBOARDING_KEY, true);
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, updateSetting, onboardingComplete, completeOnboarding }}>
            {children}
        </SettingsContext.Provider>
    );
};
