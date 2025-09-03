/**
 * Particle Connect React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View, Text, TouchableOpacity, Alert } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import * as particleConnect from '@particle-network/rn-connect';
import * as particleAuthCore from '@particle-network/rn-auth-core';
import { Ethereum, Polygon, EthereumSepolia } from '@particle-network/chains';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);

  useEffect(() => {
    // Initialize Particle Connect
    initializeParticleConnect();
  }, []);

  const initializeParticleConnect = async () => {
    try {
      // Chain configuration - using Ethereum as primary chain
      const chainInfo = Ethereum;
      
      // Environment configuration - use Env.Dev for development
      const env = particleConnect.Env.Dev;
      
      // DApp metadata configuration
      const metadata = {
        walletConnectProjectId: 'c5bd5bd54c56e1873c37a7f74c6117bf', // Replace with your WalletConnect Project ID
        url: 'https://your-app-domain.com',
        icon: 'https://your-app-domain.com/icon-512x512.png',
        name: 'ParticleConnect App',
        description: 'A React Native app with Particle Connect integration',
        redirect: '',
        verifyUrl: ''
      };

      // Initialize Particle Connect
      await particleConnect.init(chainInfo, env, metadata);
      
      // Initialize Particle Auth Core
      await particleAuthCore.init();

      // Configure additional chains for WalletConnect support
      const supportedChains = [Ethereum, Polygon, EthereumSepolia];
      await particleConnect.setWalletConnectV2SupportChainInfos(supportedChains);

      console.log('Particle Connect initialized successfully!');
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize Particle Connect:', error);
      Alert.alert('Initialization Error', 'Failed to initialize Particle Connect');
    }
  };

  const connectWallet = async () => {
    try {
      // ConnectKit configuration
      const config = {
        // You can control the array elements and adjust the order shown in the UI
        connectOptions: [
          particleConnect.ConnectOption.Email, 
          particleConnect.ConnectOption.Phone, 
          particleConnect.ConnectOption.Social, 
          particleConnect.ConnectOption.Wallet
        ],
        // You can control the array elements and adjust the order shown in the UI
        socialProviders: [
          particleConnect.EnableSocialProvider.Google, 
          particleConnect.EnableSocialProvider.Apple, 
          particleConnect.EnableSocialProvider.Twitter, 
          particleConnect.EnableSocialProvider.Discord, 
          particleConnect.EnableSocialProvider.Github
        ],
        // You can control the array elements and adjust the order shown in the UI
        walletProviders: [
          { 
            enableWallet: particleConnect.EnableWallet.MetaMask, 
            label: particleConnect.EnableWalletLabel.Recommended 
          },
          { 
            enableWallet: particleConnect.EnableWallet.OKX, 
            label: particleConnect.EnableWalletLabel.Popular 
          },
          { 
            enableWallet: particleConnect.EnableWallet.Trust, 
            label: particleConnect.EnableWalletLabel.None 
          },
          { 
            enableWallet: particleConnect.EnableWallet.Bitget, 
            label: particleConnect.EnableWalletLabel.None 
          }
        ],
        additionalLayoutOptions: {
          isCollapseWalletList: false,
          isSplitEmailAndSocial: true,
          isSplitEmailAndPhone: false,
          isHideContinueButton: false,
        },
        logo: undefined // You can add a base64 string or image URL here
      };

      const result = await particleConnect.connectWithConnectKitConfig(config);
      
      console.log('Connected successfully:', result);
      setAccountInfo(result);
      setIsConnected(true);
      
      Alert.alert('Success', `Connected with account: ${result.publicAddress || 'Unknown'}`);
    } catch (error) {
      console.error('Connection failed:', error);
      Alert.alert('Connection Error', 'Failed to connect wallet');
    }
  };

  const disconnectWallet = async () => {
    try {
      if (accountInfo) {
        await particleConnect.disconnect(accountInfo.publicAddress);
        setAccountInfo(null);
        setIsConnected(false);
        console.log('Disconnected successfully');
        Alert.alert('Success', 'Wallet disconnected successfully');
      }
    } catch (error) {
      console.error('Disconnect failed:', error);
      Alert.alert('Disconnect Error', 'Failed to disconnect wallet');
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent 
        isInitialized={isInitialized}
        isConnected={isConnected}
        accountInfo={accountInfo}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
      />
    </SafeAreaProvider>
  );
}

interface AppContentProps {
  isInitialized: boolean;
  isConnected: boolean;
  accountInfo: any;
  onConnect: () => void;
  onDisconnect: () => void;
}

function AppContent({ isInitialized, isConnected, accountInfo, onConnect, onDisconnect }: AppContentProps) {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Particle Connect Demo</Text>
        <Text style={styles.subtitle}>
          {!isInitialized ? 'Initializing...' : 'Ready to connect'}
        </Text>
      </View>

      <View style={styles.content}>
        {!isConnected ? (
          <View style={styles.connectionSection}>
            <Text style={styles.sectionTitle}>Connect Your Wallet</Text>
            <Text style={styles.description}>
              Choose from multiple wallet options including MetaMask, social logins, email, and more.
            </Text>
            
            <TouchableOpacity
              style={[styles.connectButton, !isInitialized && styles.disabledButton]}
              onPress={onConnect}
              disabled={!isInitialized}
            >
              <Text style={styles.connectButtonText}>
                {isInitialized ? 'Connect Wallet' : 'Initializing...'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.connectionSection}>
            <Text style={styles.sectionTitle}>✅ Wallet Connected</Text>
            
            {accountInfo && (
              <View style={styles.accountInfo}>
                <Text style={styles.accountLabel}>Account Address:</Text>
                <Text style={styles.accountAddress}>
                  {accountInfo.publicAddress || 'Unknown'}
                </Text>
                
                {accountInfo.name && (
                  <>
                    <Text style={styles.accountLabel}>Account Name:</Text>
                    <Text style={styles.accountValue}>{accountInfo.name}</Text>
                  </>
                )}
                
                {accountInfo.walletType && (
                  <>
                    <Text style={styles.accountLabel}>Wallet Type:</Text>
                    <Text style={styles.accountValue}>{accountInfo.walletType}</Text>
                  </>
                )}
              </View>
            )}
            
            <TouchableOpacity
              style={styles.disconnectButton}
              onPress={onDisconnect}
            >
              <Text style={styles.disconnectButtonText}>Disconnect Wallet</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  connectionSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  connectButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  disconnectButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  disconnectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  accountInfo: {
    marginVertical: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  accountLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
  },
  accountAddress: {
    fontSize: 14,
    fontFamily: 'Courier New',
    color: '#007AFF',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 6,
  },
  accountValue: {
    fontSize: 16,
    color: '#333',
  },
});

export default App;
