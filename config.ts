export const userServiceUrl = "http://107.21.189.199:8081";
export const routeServiceUrl = "http://47.128.250.151:8082";
export const apiKey = "your_api_key";
export const timeout = 5000;

export const userServiceEndpoints = {
    login: `${userServiceUrl}/api/auth/login`,
};

export const routeServiceEndpoints = {
    getRoutes: `${routeServiceUrl}/api/routes`,
    getRouteById: (id: string) => `${routeServiceUrl}/api/routes/${id}`,
};
