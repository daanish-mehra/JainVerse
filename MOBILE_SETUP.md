# 📱 Running JainAI on Mobile Devices

## Current Setup
JainAI is a **Next.js web app** that can run on mobile in several ways:

## Option 1: Browser on Simulator/Emulator (Easiest)

### iOS Simulator
1. Install Xcode from App Store
2. Open Xcode → Preferences → Components → Install iOS Simulator
3. Launch Simulator: `open -a Simulator`
4. In Simulator, open Safari
5. Navigate to: `http://localhost:4000` or your network IP

### Android Emulator
1. Install Android Studio
2. Create an Android Virtual Device (AVD)
3. Start the emulator
4. Open Chrome in the emulator
5. Navigate to: `http://10.0.2.2:4000` (maps to localhost)

### Physical Device
1. Find your computer's IP: `ifconfig | grep "inet "`
2. Make sure your device and computer are on the same network
3. On your phone, open browser and go to: `http://YOUR_IP:4000`

## Option 2: Progressive Web App (PWA)

### On iOS (Safari)
1. Open the app in Safari
2. Tap Share button
3. Select "Add to Home Screen"
4. App appears on home screen

### On Android (Chrome)
1. Open the app in Chrome
2. Tap menu (3 dots)
3. Select "Add to Home Screen" or "Install App"
4. App appears on home screen

## Option 3: Native App with Capacitor (Recommended for Production)

### Setup Capacitor

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android

# Initialize Capacitor
npx cap init "JainAI" "com.jainverse.jainai"

# Build your Next.js app
npm run build

# Add iOS platform
npx cap add ios

# Add Android platform
npx cap add android

# Sync web assets
npx cap sync

# Open in Xcode
npx cap open ios

# Open in Android Studio
npx cap open android
```

### Build Commands
```bash
# Build Next.js
npm run build

# Sync to native platforms
npx cap sync

# Copy to native projects
npx cap copy
```

## Option 4: React Native (Full Native Rewrite)

If you want a truly native app, you'd need to:
1. Use React Native CLI or Expo
2. Rewrite UI components in React Native
3. Use native navigation (React Navigation)
4. Access native APIs (camera, notifications, etc.)

This is a significant rewrite but provides the best mobile experience.

## Recommendation

For the hackathon:
- **Quick Demo**: Use Option 1 (simulator/emulator)
- **Real Testing**: Use Option 2 (PWA on physical device)
- **Production**: Use Option 3 (Capacitor for native app store deployment)

## Current Status

✅ PWA manifest configured
✅ Responsive mobile design
✅ Touch-friendly UI
✅ Bottom navigation for mobile
✅ Mobile-optimized text sizes

Next steps for native app:
1. Set up Capacitor (see Option 3)
2. Configure app icons and splash screens
3. Test on physical devices
4. Submit to App Store / Play Store

