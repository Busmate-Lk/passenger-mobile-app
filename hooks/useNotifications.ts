import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ensureDevicePushRegistered, listNotifications, NotificationRecord, setupNotificationListeners } from '@/services/notificationService';

export function useNotifications() {
    const { accessToken, isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [registered, setRegistered] = useState(false);

    const refresh = useCallback(async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const data = await listNotifications(50, accessToken || undefined);
            setNotifications(data);
            setError(null);
        } catch (e: any) {
            setError(e.message || 'Failed to load notifications');
        } finally {
            setLoading(false);
        }
    }, [accessToken, isAuthenticated]);

    useEffect(() => {
        console.log('[useNotifications] effect run', {
            isAuthenticated,
            hasAccessToken: !!accessToken,
            accessTokenPreview: accessToken ? accessToken.substring(0, 12) + '...' : null,
            registered
        });
        if (!isAuthenticated) {
            if (registered) {
                console.log('[useNotifications] user logged out, clearing notifications state');
                setNotifications([]);
                setRegistered(false);
            }
            return;
        }
        if (isAuthenticated && !registered) {
            console.log('[useNotifications] registering device push token...');
            ensureDevicePushRegistered(accessToken || undefined).then(() => {
                setRegistered(true);
                console.log('[useNotifications] registration complete');
            });
        }
        refresh();
        const cleanup = setupNotificationListeners(() => {
            console.log('[useNotifications] foreground notification received -> refresh');
            refresh();
        });
        return cleanup;
    }, [isAuthenticated, accessToken, registered, refresh]);

    return { notifications, loading, error, refresh };
}
