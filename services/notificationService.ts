import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
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

// ---- Push (Pure FCM via react-native-firebase) ----

async function requestMessagingPermission(): Promise<boolean> {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (!enabled) console.log('[FCM] Notification permission not granted');
    return enabled;
}

async function getFcmToken(): Promise<string | null> {
    try {
        const token = await messaging().getToken();
        return token;
    } catch (e) {
        console.warn('[FCM] Failed to get token', e);
        return null;
    }
}

export async function ensureDevicePushRegistered(authToken?: string) {
    try {
        const stored = await AsyncStorage.getItem('device_push_token');
        let token = stored;
        if (!token) {
            const granted = await requestMessagingPermission();
            if (!granted) return null;
            token = await getFcmToken();
        }
        if (!token) return null;

        console.log('[ensureDevicePushRegistered] Sending registration request with FCM token:', token);

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
                appVersion: '1.0.0'
            })
        });

        if (!response.ok) {
            let bodyText: string | undefined;
            try { bodyText = await response.text(); } catch { }
            console.error('[ensureDevicePushRegistered] Failed to register device push token', {
                status: response.status,
                url: response.url,
                body: bodyText
            });
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
    try {
        const token = await AsyncStorage.getItem('device_push_token');
        if (!token) return;
        await fetch(`${MOBILE_PUSH_API}/unregister`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
            body: JSON.stringify({ deviceToken: token })
        });
        await AsyncStorage.removeItem('device_push_token');
    } catch (e) {
        console.warn('Failed to unregister push token', e);
    }
}

export function setupNotificationListeners(onReceive?: (n: any) => void, onResponse?: (r: any) => void) {
    // Foreground messages
    const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage: any) => {
        console.log('[FCM] Foreground message received', remoteMessage?.messageId);
        if (onReceive) onReceive(remoteMessage);
        Alert.alert(remoteMessage?.notification?.title || 'Notification', remoteMessage?.notification?.body || '');
    });
    // App opened from quit/background
    const unsubscribeOpened = messaging().onNotificationOpenedApp((remoteMessage: any) => {
        console.log('[FCM] Notification opened from background', remoteMessage?.messageId);
        if (onResponse) onResponse(remoteMessage);
    });
    // App opened from quit state initial notification
    messaging().getInitialNotification().then((remoteMessage: any) => {
        if (remoteMessage && onResponse) {
            console.log('[FCM] App opened from quit by notification', remoteMessage?.messageId);
            onResponse(remoteMessage);
        }
    });
    return () => {
        unsubscribeOnMessage();
        unsubscribeOpened();
    };
}
