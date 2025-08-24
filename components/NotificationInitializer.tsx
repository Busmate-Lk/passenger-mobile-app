import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';

// Mount this high in the tree (inside AuthProvider) to auto register device token after login.
export default function NotificationInitializer() {
    useNotifications();
    return null;
}
