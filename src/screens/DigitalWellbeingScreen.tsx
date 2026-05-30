import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Switch,
  NativeModules,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/Header';
import { useTheme } from '../components/ThemeContext';

const { DigitalWellbeingModule } = NativeModules;

interface AppUsage {
  packageName: string;
  appName: string;
  usageTimeMs: number;
}

interface AppLimits {
  [packageName: string]: number; // Limit in minutes
}

interface Props {
  navigate: (screen: string) => void;
}

const DigitalWellbeingScreen: React.FC<Props> = ({ navigate }) => {
  const { colors, isDark } = useTheme();
  
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [apps, setApps] = useState<AppUsage[]>([]);
  const [limits, setLimits] = useState<AppLimits>({});
  const [serviceActive, setServiceActive] = useState<boolean>(false);
  const [selectedApp, setSelectedApp] = useState<AppUsage | null>(null);
  const [limitInput, setLimitInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    checkPermissionAndLoad();
  }, []);

  const checkPermissionAndLoad = async () => {
    try {
      setLoading(true);
      const isGranted = await DigitalWellbeingModule.checkUsagePermission();
      setHasPermission(isGranted);
      
      if (isGranted) {
        // Load statistics and limits
        await refreshData();
      }
    } catch (e) {
      console.error('Error loading permission stats', e);
    } finally {
      setLoading(false);
    }
  };

  const requestPermission = () => {
    Alert.alert(
      'Usage Access Required',
      'Please allow usage access permission in the system settings to monitor and limit app screen time.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open Settings', 
          onPress: () => {
            DigitalWellbeingModule.openUsageSettings();
            // Re-check after returning
            setTimeout(() => {
              checkPermissionAndLoad();
            }, 2000);
          }
        }
      ]
    );
  };

  const refreshData = async () => {
    try {
      const statsList: AppUsage[] = await DigitalWellbeingModule.getAppsUsageStats();
      
      // Sort by usage time descending
      const sortedStats = statsList.sort((a, b) => b.usageTimeMs - a.usageTimeMs);
      setApps(sortedStats);

      // Load limits from AsyncStorage
      const storedLimits = await AsyncStorage.getItem('@app_limits');
      let parsedLimits: AppLimits = {};
      if (storedLimits) {
        parsedLimits = JSON.parse(storedLimits);
        setLimits(parsedLimits);
      }

      // Load limits from native module as well to sync
      const nativeLimits = await DigitalWellbeingModule.getAppLimits();
      if (nativeLimits) {
        const mergedLimits = { ...parsedLimits, ...nativeLimits };
        setLimits(mergedLimits);
      }

      // Check service running state
      const isRunning = await AsyncStorage.getItem('@service_active');
      if (isRunning === 'true') {
        setServiceActive(true);
        await DigitalWellbeingModule.startUsageMonitoringService();
      }
    } catch (e) {
      console.error('Error refreshing data', e);
    }
  };

  const toggleService = async (value: boolean) => {
    try {
      if (value) {
        await DigitalWellbeingModule.startUsageMonitoringService();
        await AsyncStorage.setItem('@service_active', 'true');
        setServiceActive(true);
        Alert.alert('Service Started', 'Foreground monitoring service is active.');
      } else {
        await DigitalWellbeingModule.stopUsageMonitoringService();
        await AsyncStorage.setItem('@service_active', 'false');
        setServiceActive(false);
        Alert.alert('Service Stopped', 'Foreground monitoring service is inactive.');
      }
    } catch (e) {
      Alert.alert('Error', 'Could not toggle background service');
    }
  };

  const saveLimit = async () => {
    if (!selectedApp) return;

    const limitMinutes = parseInt(limitInput, 10);
    const newLimits = { ...limits };

    if (isNaN(limitMinutes) || limitMinutes <= 0) {
      delete newLimits[selectedApp.packageName];
    } else {
      newLimits[selectedApp.packageName] = limitMinutes;
    }

    try {
      // 1. Save locally in AsyncStorage
      await AsyncStorage.setItem('@app_limits', JSON.stringify(newLimits));
      
      // 2. Save in Native Shared Preferences for the service to access
      await DigitalWellbeingModule.setAppLimits(newLimits);
      
      setLimits(newLimits);
      setSelectedApp(null);
      setLimitInput('');
      
      // If service is running, restart to apply new limits immediately
      if (serviceActive) {
        await DigitalWellbeingModule.startUsageMonitoringService();
      }
      
      Alert.alert('Limit Updated', `${selectedApp.appName} limit successfully updated.`);
    } catch (e) {
      Alert.alert('Error', 'Failed to save limit');
    }
  };

  const formatUsageTime = (ms: number) => {
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const totalScreenTime = apps.reduce((sum, item) => sum + item.usageTimeMs, 0);

  const filteredApps = apps.filter(app => 
    app.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.packageName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Checking permissions...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Digital Wellbeing" showBack onBack={() => navigate('SettingsScreen')} />
      
      {!hasPermission ? (
        <View style={styles.permissionCard}>
          <Text style={[styles.emoji, { color: colors.primary }]}>🔒</Text>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Usage Stats Access Required</Text>
          <Text style={[styles.cardDescription, { color: colors.textSub }]}>
            We need Usage Access permission to view daily app usage times and set custom app limits. Please tap the button below and enable FamilyShield.
          </Text>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={requestPermission}
          >
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredApps}
          keyExtractor={(item) => item.packageName}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              {/* Dashboard Hero */}
              <LinearGradient 
                colors={['#1a0533', '#3b1278', '#6C3AE3']} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 1 }} 
                style={styles.heroCard}
              >
                <Text style={styles.heroLabel}>Total Screen Time Today</Text>
                <Text style={styles.heroTime}>{formatUsageTime(totalScreenTime)}</Text>
                <Text style={styles.heroSubText}>{apps.length} active apps monitored</Text>
              </LinearGradient>

              {/* Service Toggle */}
              <View style={[styles.serviceRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.serviceTextContainer}>
                  <Text style={[styles.serviceTitle, { color: colors.text }]}>Foreground App Blocker</Text>
                  <Text style={[styles.serviceSubtitle, { color: colors.textSub }]}>
                    Enforces limits & shows blocking screen when limit is exceeded
                  </Text>
                </View>
                <Switch
                  value={serviceActive}
                  onValueChange={toggleService}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
              </View>

              {/* Limits Setter Modal Overlay style */}
              {selectedApp && (
                <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.primary }]}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    Set Limit: {selectedApp.appName}
                  </Text>
                  <Text style={[styles.modalSub, { color: colors.textSub }]}>
                    Enter daily allowed usage limit in minutes. Leave blank or enter 0 to remove the limit.
                  </Text>
                  <View style={styles.modalInputRow}>
                    <TextInput
                      style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                      placeholder="e.g. 30"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="numeric"
                      value={limitInput}
                      onChangeText={setLimitInput}
                      autoFocus
                    />
                    <Text style={[styles.minutesLabel, { color: colors.text }]}>minutes</Text>
                  </View>
                  <View style={styles.modalButtons}>
                    <TouchableOpacity 
                      style={[styles.modalButton, { backgroundColor: colors.border }]} 
                      onPress={() => setSelectedApp(null)}
                    >
                      <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.modalButton, { backgroundColor: colors.primary }]} 
                      onPress={saveLimit}
                    >
                      <Text style={styles.buttonText}>Save Limit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Search Bar */}
              <TextInput
                style={[styles.searchBar, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
                placeholder="🔍 Search installed apps..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />

              <Text style={[styles.sectionTitle, { color: colors.text }]}>Apps Usage Stats & Limits</Text>
            </>
          }
          renderItem={({ item }) => {
            const limit = limits[item.packageName];
            return (
              <View style={[styles.appRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <View style={styles.appIconContainer}>
                  <Text style={styles.appEmoji}>📱</Text>
                </View>
                <View style={styles.appInfo}>
                  <Text style={[styles.appName, { color: colors.text }]} numberOfLines={1}>
                    {item.appName}
                  </Text>
                  <Text style={[styles.appPackage, { color: colors.textSub }]} numberOfLines={1}>
                    {item.packageName}
                  </Text>
                  <View style={styles.statContainer}>
                    <Text style={[styles.appUsageText, { color: colors.primary }]}>
                      Today: {formatUsageTime(item.usageTimeMs)}
                    </Text>
                    {limit ? (
                      <Text style={[styles.limitBadge, { backgroundColor: isDark ? '#3b1278' : '#e0e7ff', color: colors.primary }]}>
                        Limit: {limit}m
                      </Text>
                    ) : null}
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.limitBtn, { backgroundColor: limit ? colors.primary : colors.border }]}
                  onPress={() => {
                    setSelectedApp(item);
                    setLimitInput(limit ? limit.toString() : '');
                  }}
                >
                  <Text style={[styles.limitBtnText, { color: limit ? '#fff' : colors.text }]}>
                    {limit ? 'Edit' : 'Limit'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No apps usage detected today.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  permissionCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    textAlign: 'center',
  },
  emoji: {
    fontSize: 72,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 32,
  },
  primaryButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  listContent: {
    padding: 20,
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    elevation: 6,
  },
  heroLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroTime: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '900',
    marginVertical: 8,
  },
  heroSubText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  serviceTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  serviceSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  searchBar: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 12,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  appIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(108, 58, 227, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  appEmoji: {
    fontSize: 22,
  },
  appInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  appName: {
    fontSize: 15,
    fontWeight: '700',
  },
  appPackage: {
    fontSize: 11,
    marginTop: 2,
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  appUsageText: {
    fontSize: 12,
    fontWeight: '600',
  },
  limitBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  limitBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  limitBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalCard: {
    borderRadius: 20,
    borderWidth: 2,
    padding: 20,
    marginBottom: 20,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  modalSub: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  modalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  minutesLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
  },
});

export default DigitalWellbeingScreen;
