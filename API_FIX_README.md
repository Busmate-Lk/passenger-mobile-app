# API Connection Fix for Busmate Passenger Mobile App

## Problem
The Busmate passenger mobile app APK was not working properly with backend APIs when built for production. The APIs were not loading responses correctly due to Android network security restrictions blocking HTTP traffic.

## Root Causes
1. **HTTP URLs in Production**: The app was using HTTP instead of HTTPS endpoints
2. **Android Network Security**: Android blocks cleartext (HTTP) traffic by default in production APKs
3. **Hardcoded API URLs**: API endpoints were hardcoded without environment-based configuration

## Solutions Implemented

### 1. Android Network Security Configuration
- Added `usesCleartextTraffic: true` to `app.json`
- Created `android_network_security_config.xml` to allow HTTP traffic for specific domains
- Configured specific domains for all API endpoints

### 2. Environment-Based Configuration
- Created `config/env.ts` for centralized API endpoint management
- Updated `config.ts` to use environment variables
- Added support for development vs production endpoints

### 3. Dynamic API Client Configuration
- Created `lib/api-client/apiConfig.ts` for runtime API configuration
- Added initialization function to set proper base URLs
- Updated app layout to initialize API clients on startup

### 4. Enhanced Error Handling
- Created `lib/utils/apiErrorHandler.ts` for better error management
- Added network connectivity checking
- Improved user-friendly error messages

## Files Modified/Created

### Modified Files:
- `app.json` - Added Android network security config
- `config.ts` - Updated to use environment variables
- `app/_layout.tsx` - Added API client initialization
- `package.json` - Added build scripts

### New Files:
- `android_network_security_config.xml` - Network security configuration
- `config/env.ts` - Environment configuration
- `lib/api-client/apiConfig.ts` - API client configuration
- `lib/utils/apiErrorHandler.ts` - Error handling utilities

## API Endpoints Configured
- **User Service**: `http://107.21.189.199:8081`
- **Route Service**: `http://18.140.161.237:8080`
- **Ticketing Service**: `http://54.91.217.117:8083`
- **Location Service**: `http://47.128.250.151:4000`

## How to Build and Test

### 1. Clean and Install Dependencies
```bash
cd /home/kavinda/Desktop/Desktop/BusMate/passenger-mobile-app
npm install
npx expo install --fix
```

### 2. Build for Preview (APK)
```bash
npm run build:android
```

### 3. Build for Production
```bash
npm run build:android:production
```

### 4. Test the APK
1. Download the built APK from EAS
2. Install on a physical Android device
3. Test API functionality:
   - Login functionality
   - Route searching
   - Ticket booking
   - Location tracking

## Debugging

### Check API Connectivity
The app now includes debugging tools. You can check the console for:
- API endpoint configurations
- Network connectivity status
- Detailed error messages

### Common Issues and Solutions

1. **Still getting network errors?**
   - Verify the API servers are running
   - Check if the IP addresses are correct
   - Ensure firewall allows connections

2. **Build fails?**
   - Run `npx expo doctor` to check for issues
   - Clear cache: `npx expo r -c`
   - Reinstall dependencies

3. **APIs working in development but not in APK?**
   - Verify network security config is applied
   - Check Android logs using `adb logcat`

## Future Improvements

### Recommended: Upgrade to HTTPS
For production apps, it's recommended to:
1. Set up SSL certificates for your API servers
2. Update all endpoints to use HTTPS
3. Remove the cleartext traffic configuration

### Environment Variables
Consider using Expo's environment variables for better security:
```bash
# .env
USER_SERVICE_URL=https://your-secure-api.com
ROUTE_SERVICE_URL=https://your-secure-api.com
```

## Support
If you encounter any issues:
1. Check the console logs for detailed error messages
2. Verify API server status
3. Test network connectivity
4. Review the error handling utilities for debugging

---
**Note**: This configuration allows HTTP traffic which is less secure. For production apps, always prefer HTTPS endpoints with proper SSL certificates.