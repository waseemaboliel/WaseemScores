import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const registerForPushNotifications = async (): Promise<string | null> => {
    if (!Device.isDevice) {
        return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        return null;
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('goals', {
            name: 'Goal Alerts',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#4CAF50',
        });
    }

    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
};

export const sendLocalGoalNotification = async (
    teamName: string,
    scorer: string,
    matchTitle: string,
    score: string,
) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: `⚽ GOAL! ${teamName}`,
            body: `${scorer} scores! ${matchTitle} ${score}`,
            data: { type: 'goal' },
            sound: 'default',
        },
        trigger: null,
    });
};

export const sendMatchStartNotification = async (
    matchTitle: string,
) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: '🏟️ Match Starting',
            body: `${matchTitle} is about to kick off!`,
            data: { type: 'kickoff' },
            sound: 'default',
        },
        trigger: null,
    });
};
