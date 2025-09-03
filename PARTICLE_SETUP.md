# Particle Connect Setup Guide

## ✅ Completed Configuration

### iOS Configuration
- ✅ ParticleNetwork-Info.plist with your credentials
- ✅ AppDelegate.swift with URL handling
- ✅ Info.plist with URL schemes and wallet app schemes
- ✅ CocoaPods dependencies installed

### React Native Integration
- ✅ Particle Connect packages installed
- ✅ Initialization code implemented in App.tsx

## 🔧 Required Customizations

### 1. WalletConnect Project ID
In `App.tsx`, replace `YOUR_WALLETCONNECT_PROJECT_ID` with your actual WalletConnect Project ID:

```typescript
const metadata = {
  walletConnectProjectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // 👈 Replace this
  // ... other metadata
};
```

**How to get WalletConnect Project ID:**
1. Go to https://cloud.walletconnect.com/
2. Create a new project or use existing one
3. Copy the Project ID

### 2. App Metadata (Optional)
Update the metadata object in `App.tsx` with your app details:

```typescript
const metadata = {
  walletConnectProjectId: 'your-project-id',
  url: 'https://your-app-domain.com',                    // Your app's website
  icon: 'https://your-app-domain.com/icon-512x512.png', // Your app icon (512x512)
  name: 'Your App Name',                                 // Your app name
  description: 'Your app description',                   // App description
  redirect: '',                                          // Leave empty
  verifyUrl: ''                                          // Leave empty
};
```

## 🚀 How to Run

### iOS
```bash
npx react-native run-ios
```

### Testing the Setup
The app will initialize Particle Connect on startup. Check the console logs for:
- `Particle Connect initialized successfully!` ✅
- Or any error messages ❌

## 📱 Next Steps

After successful initialization, you can:
1. Implement wallet connection UI
2. Add authentication flows
3. Handle blockchain transactions
4. Integrate with specific wallets (MetaMask, Phantom, etc.)

## 🔍 Current Configuration Summary

**Project Credentials:**
- PROJECT_UUID: `9a47a52a-caf2-4e16-a96b-e6d0474fa79a`
- PROJECT_CLIENT_KEY: `cbNRbygib7hbI9k4WbmQtGBgUNCgVlTXgzEp4bc3`
- PROJECT_APP_UUID: `e996f31c-7fb1-4584-ac1e-ecdcd5efa872`

**URL Scheme:** `pn9a47a52a-caf2-4e16-a96b-e6d0474fa79a`

**Supported Chains:** Ethereum, Polygon, Ethereum Sepolia

**Environment:** Development (Env.Dev)
