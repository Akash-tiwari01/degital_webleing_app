/**
 * Family Device Management App
 * Main entry point — State-based navigator for all 22 screens
 */

import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, View, StyleSheet, AppState, Platform, NativeModules } from 'react-native';
import { ThemeProvider, useTheme } from './src/components/ThemeContext';

// ── Splash ──────────────────────────────────────────────
import SplashScreen from './src/screens/SplashScreen';

// ── Onboarding ──────────────────────────────────────────
import WelcomeScreen from './src/screens/WelcomeScreen';
import ModeSelection from './src/screens/ModeSelection';
import DetailsEntry from './src/screens/DetailsEntry';

// ── Self Mode Setup ──────────────────────────────────────
import SelfGoals from './src/screens/SelfGoals';
import SelfRules from './src/screens/SelfRules';
import SelfFocusSchedule from './src/screens/SelfFocusSchedule';

// ── Family Mode Setup ────────────────────────────────────
import ParentFaceEnroll from './src/screens/ParentFaceEnroll';
import FamilyOverview from './src/screens/FamilyOverview';
import ChildDetails from './src/screens/ChildDetails';
import ChildFaceEnroll from './src/screens/ChildFaceEnroll';
import ChildAppRules from './src/screens/ChildAppRules';
import ChildSchoolHours from './src/screens/ChildSchoolHours';

// ── Child Device Mode ────────────────────────────────────
import ChildDeviceDetails from './src/screens/ChildDeviceDetails';
import ChildDeviceFaceEnroll from './src/screens/ChildDeviceFaceEnroll';
import ParentDeviceFaceEnroll from './src/screens/ParentDeviceFaceEnroll';
import DeviceRules from './src/screens/DeviceRules';

// ── Session Flow ─────────────────────────────────────────
import FaceScanOverlay from './src/screens/FaceScanOverlay';
import ProfileIdentified from './src/screens/ProfileIdentified';
import ProfilePicker from './src/screens/ProfilePicker';
import PinEntry from './src/screens/PinEntry';

// ── Home Screens ─────────────────────────────────────────
import SelfHome from './src/screens/SelfHome';
import ParentHome from './src/screens/ParentHome';
import ChildHome from './src/screens/ChildHome';

// ── Lock + Unlock ─────────────────────────────────────────
import AppBlocked from './src/screens/AppBlocked';
import DailyLimitReached from './src/screens/DailyLimitReached';
import ParentUnlockFlow from './src/screens/ParentUnlockFlow';
import TempAccessTimer from './src/screens/TempAccessTimer';

// ── Management ────────────────────────────────────────────
import FamilyTab from './src/screens/FamilyTab';
import ParentPanel from './src/screens/ParentPanel';
import EditChildRules from './src/screens/EditChildRules';
import StatsScreen from './src/screens/StatsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DigitalWellbeingScreen from './src/screens/DigitalWellbeingScreen';

type ScreenName =
  | 'SplashScreen'
  | 'WelcomeScreen' | 'ModeSelection' | 'DetailsEntry'
  | 'SelfGoals' | 'SelfRules' | 'SelfFocusSchedule'
  | 'ParentFaceEnroll' | 'FamilyOverview' | 'ChildDetails'
  | 'ChildFaceEnroll' | 'ChildAppRules' | 'ChildSchoolHours'
  | 'ChildDeviceDetails' | 'ChildDeviceFaceEnroll' | 'ParentDeviceFaceEnroll' | 'DeviceRules'
  | 'FaceScanOverlay' | 'ProfileIdentified' | 'ProfilePicker' | 'PinEntry'
  | 'SelfHome' | 'ParentHome' | 'ChildHome'
  | 'AppBlocked' | 'DailyLimitReached' | 'ParentUnlockFlow' | 'TempAccessTimer'
  | 'FamilyTab' | 'ParentPanel' | 'EditChildRules' | 'StatsScreen' | 'SettingsScreen'
  | 'DigitalWellbeingScreen';

// ─── Inner app (has access to theme context) ────────────────────────────────
function AppInner(): React.JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('SplashScreen');
  const [blockedAppName, setBlockedAppName] = useState<string>('App');
  const { colors } = useTheme();

  const navigate = (screen: string, params?: any) => {
    setCurrentScreen(screen as ScreenName);
    if (screen === 'AppBlocked' && params?.appName) {
      setBlockedAppName(params.appName);
    }
  };

  useEffect(() => {
    const checkBlockedAppIntent = async () => {
      if (Platform.OS === 'android' && NativeModules.DigitalWellbeingModule) {
        try {
          const blocked = await NativeModules.DigitalWellbeingModule.getLaunchBlockedApp();
          if (blocked) {
            navigate('AppBlocked', { appName: blocked });
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    checkBlockedAppIntent();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkBlockedAppIntent();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const renderScreen = () => {
    const props = { navigate };
    switch (currentScreen) {
      case 'SplashScreen':           return <SplashScreen {...props} />;
      // 01 Onboarding
      case 'WelcomeScreen':          return <WelcomeScreen {...props} />;
      case 'ModeSelection':          return <ModeSelection {...props} />;
      case 'DetailsEntry':           return <DetailsEntry {...props} />;
      // 02 Self Mode Setup
      case 'SelfGoals':              return <SelfGoals {...props} />;
      case 'SelfRules':              return <SelfRules {...props} />;
      case 'SelfFocusSchedule':      return <SelfFocusSchedule {...props} />;
      // 03 Family Mode Setup
      case 'ParentFaceEnroll':       return <ParentFaceEnroll {...props} />;
      case 'FamilyOverview':         return <FamilyOverview {...props} />;
      case 'ChildDetails':           return <ChildDetails {...props} />;
      case 'ChildFaceEnroll':        return <ChildFaceEnroll {...props} />;
      case 'ChildAppRules':          return <ChildAppRules {...props} />;
      case 'ChildSchoolHours':       return <ChildSchoolHours {...props} />;
      // 04 Child Device Mode
      case 'ChildDeviceDetails':     return <ChildDeviceDetails {...props} />;
      case 'ChildDeviceFaceEnroll':  return <ChildDeviceFaceEnroll {...props} />;
      case 'ParentDeviceFaceEnroll': return <ParentDeviceFaceEnroll {...props} />;
      case 'DeviceRules':            return <DeviceRules {...props} />;
      // 05 Session Flow
      case 'FaceScanOverlay':        return <FaceScanOverlay {...props} />;
      case 'ProfileIdentified':      return <ProfileIdentified {...props} />;
      case 'ProfilePicker':          return <ProfilePicker {...props} />;
      case 'PinEntry':               return <PinEntry {...props} />;
      // 06 Home Screens
      case 'SelfHome':               return <SelfHome {...props} />;
      case 'ParentHome':             return <ParentHome {...props} />;
      case 'ChildHome':              return <ChildHome {...props} />;
      // 07 Lock + Unlock
      case 'AppBlocked':             return <AppBlocked navigate={navigate} appName={blockedAppName} />;
      case 'DailyLimitReached':      return <DailyLimitReached {...props} />;
      case 'ParentUnlockFlow':       return <ParentUnlockFlow {...props} />;
      case 'TempAccessTimer':        return <TempAccessTimer {...props} />;
      // 08 Management
      case 'FamilyTab':              return <FamilyTab {...props} />;
      case 'ParentPanel':            return <ParentPanel {...props} />;
      case 'EditChildRules':         return <EditChildRules {...props} />;
      case 'StatsScreen':            return <StatsScreen {...props} />;
      case 'SettingsScreen':         return <SettingsScreen {...props} />;
      case 'DigitalWellbeingScreen': return <DigitalWellbeingScreen {...props} />;
      default:                       return <WelcomeScreen {...props} />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
      />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {renderScreen()}
      </View>
    </SafeAreaProvider>
  );
}

// ─── Root App wrapped with ThemeProvider ────────────────────────────────────
function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

export default App;
