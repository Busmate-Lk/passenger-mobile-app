import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { API_BASE_URL } from '@/config';

// Adjust paths or config as needed
// Server endpoints derived from backend notification service
function ensureApiPrefix(base: string) {
    if (!base) return base;
    // remove trailing slash
    const b = base.endsWith('/') ? base.slice(0, -1) : base;
    return b.endsWith('/api') ? b : `${b}/api`;
}

const API_BASE = ensureApiPrefix(API_BASE_URL || '');
const NOTIFICATION_API = `${API_BASE}/notifications`;
const MOBILE_PUSH_API = `${API_BASE}/mobile-push`;

export type NotificationRecord = {
    notificationId: string;
    title: string;
    subject: string;
    body: string;
    messageType: string;
    targetAudience: string;
    createdAt: string;
};

export async function listNotifications(limit: number = 50, token?: string): Promise<NotificationRecord[]> {
    const res = await fetch(`${NOTIFICATION_API}/list?limit=${limit}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
    if (!res.ok) throw new Error('Failed to load notifications');
    const data = await res.json();
    return data.notifications || [];
}

export async function getNotificationDetails(id: string, token?: string) {
    const res = await fetch(`${NOTIFICATION_API}/details/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
    if (!res.ok) throw new Error('Failed to load notification');
    return (await res.json()).notification;
}

export async function recordNotificationClick(notificationId: string) {
    try {
        await fetch(`${NOTIFICATION_API}/click`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notificationId })
        });
    } catch (e) {
        console.warn('Failed to record click', e);
    }
}

// ---- Push (FCM via Expo) ----

async function registerForPushNotificationsAsync(): Promise<string | null> {
    if (!Device.isDevice) {
        console.log('Must use physical device for push notifications');
        return null;
    }

    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
    }

    try {
        // Attempt to get a native device push token (FCM/APNS) on bare/standalone builds
        const nativeToken = await Notifications.getDevicePushTokenAsync().catch(() => null);
        if (nativeToken?.data) return nativeToken.data;
    } catch (e) {
        console.log('Native device push token not available yet, falling back to Expo token');
    }
    try {
        const projectId = (Constants as any)?.expoConfig?.extra?.eas?.projectId || (Constants as any)?.easConfig?.projectId;
        const tokenData = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined as any);
        return tokenData.data;
    } catch (e) {
        console.warn('Error getting Expo push token', e);
        return null;
    }
}

export async function ensureDevicePushRegistered(authToken?: string) {
    try {
        const stored = await AsyncStorage.getItem('device_push_token');
        let token = stored || await registerForPushNotificationsAsync();
        if (!token) return null;

        console.log('[ensureDevicePushRegistered] Sending registration request with token:', token);

        // Register with backend
        const response = await fetch(`${MOBILE_PUSH_API}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
            },
            body: JSON.stringify({
                deviceToken: token,
                platform: Platform.OS,
                appVersion: Constants.nativeAppVersion || Constants.expoVersion
            })
        });

        if (!response.ok) {
            console.error('[ensureDevicePushRegistered] Failed to register device push token', response);
            return null;
        }

        console.log('[ensureDevicePushRegistered] Registration request completed');
        return token;
    } catch (e) {
        console.warn('Failed to register device push token', e);
        return null;
    }
}


export async function unregisterDevicePush(authToken?: string) {
    const token = await AsyncStorage.getItem('device_push_token');
    if (!token) return;
    try {
        await fetch(`${MOBILE_PUSH_API}/unregister`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
            body: JSON.stringify({ deviceToken: token })
        });
    } catch (e) {
        console.warn('Failed to unregister push token', e);
    }
}

// Configure notification handler (foreground behavior)
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false
    })
});

export function setupNotificationListeners(onReceive?: (n: Notifications.Notification) => void, onResponse?: (r: Notifications.NotificationResponse) => void) {
    const subReceive = Notifications.addNotificationReceivedListener((notification: Notifications.Notification) => {
        if (onReceive) onReceive(notification);
    });
    const subResponse = Notifications.addNotificationResponseReceivedListener((response: Notifications.NotificationResponse) => {
        if (onResponse) onResponse(response);
    });
    return () => {
        subReceive.remove();
        subResponse.remove();
    };
}
