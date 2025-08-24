export const userServiceUrl = "http://18.140.161.237:8081";
export const routeServiceUrl = "http://18.140.161.237:8080";
// Base URL for notification service (adjust if different host/port)
// "http://13.51.177.104:8080"
export const notificationServiceUrl = "http://192.168.1.4:8080";
export const API_BASE_URL = notificationServiceUrl; // For notificationService.ts
export const apiKey = "your_api_key";
export const timeout = 5000;

export const userServiceEndpoints = {
    login: `${userServiceUrl}/api/auth/login`,
};

export const routeServiceEndpoints = {
    getRoutes: `${routeServiceUrl}/api/routes`,
    getRouteById: (id: string) => `${routeServiceUrl}/api/routes/${id}`,
};

// Notification endpoints (used mostly internally via services/notificationService.ts)
export const notificationServiceEndpoints = {
    list: (limit: number = 50) => `${notificationServiceUrl}/api/notifications/list?limit=${limit}`,
    details: (id: string) => `${notificationServiceUrl}/api/notifications/details/${id}`,
    click: `${notificationServiceUrl}/api/notifications/click`,
    registerDevice: `${notificationServiceUrl}/api/mobile-push/register`, // Updated path
    unregisterDevice: `${notificationServiceUrl}/api/mobile-push/unregister`,
};

