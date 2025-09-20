import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import VerifyEmailScreen from '../screens/auth/VerifyEmailScreen';
import VerifyPhoneScreen from '../screens/auth/VerifyPhoneScreen';

// Main Screens
import HomeScreen from '../screens/main/HomeScreen';
import SearchScreen from '../screens/main/SearchScreen';
import BookingsScreen from '../screens/main/BookingsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import VehiclesScreen from '../screens/main/VehiclesScreen';
import EmergencyScreen from '../screens/main/EmergencyScreen';
import CommunityScreen from '../screens/main/CommunityScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';

// Service Provider Screens
import MechanicDashboardScreen from '../screens/provider/MechanicDashboardScreen';
import GarageDashboardScreen from '../screens/provider/GarageDashboardScreen';
import BookingDetailsScreen from '../screens/provider/BookingDetailsScreen';
import EarningsScreen from '../screens/provider/EarningsScreen';

// Common Screens
import BookingDetailsScreen as CustomerBookingDetails from '../screens/common/BookingDetailsScreen';
import PaymentScreen from '../screens/common/PaymentScreen';
import ChatScreen from '../screens/common/ChatScreen';
import MapScreen from '../screens/common/MapScreen';
import SettingsScreen from '../screens/common/SettingsScreen';
import HelpScreen from '../screens/common/HelpScreen';
import AboutScreen from '../screens/common/AboutScreen';

// Components
import CustomDrawerContent from '../components/navigation/CustomDrawerContent';
import LoadingScreen from '../components/common/LoadingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
    <Stack.Screen name="VerifyPhone" component={VerifyPhoneScreen} />
  </Stack.Navigator>
);

// Customer Tab Navigator
const CustomerTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Home':
            iconName = 'home';
            break;
          case 'Search':
            iconName = 'search';
            break;
          case 'Bookings':
            iconName = 'book-online';
            break;
          case 'Vehicles':
            iconName = 'directions-car';
            break;
          case 'Profile':
            iconName = 'person';
            break;
          default:
            iconName = 'circle';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007bff',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Bookings" component={BookingsScreen} />
    <Tab.Screen name="Vehicles" component={VehiclesScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// Mechanic Tab Navigator
const MechanicTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Dashboard':
            iconName = 'dashboard';
            break;
          case 'Bookings':
            iconName = 'book-online';
            break;
          case 'Earnings':
            iconName = 'attach-money';
            break;
          case 'Profile':
            iconName = 'person';
            break;
          default:
            iconName = 'circle';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007bff',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Dashboard" component={MechanicDashboardScreen} />
    <Tab.Screen name="Bookings" component={BookingsScreen} />
    <Tab.Screen name="Earnings" component={EarningsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// Garage Tab Navigator
const GarageTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Dashboard':
            iconName = 'dashboard';
            break;
          case 'Bookings':
            iconName = 'book-online';
            break;
          case 'Earnings':
            iconName = 'attach-money';
            break;
          case 'Profile':
            iconName = 'person';
            break;
          default:
            iconName = 'circle';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007bff',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Dashboard" component={GarageDashboardScreen} />
    <Tab.Screen name="Bookings" component={BookingsScreen} />
    <Tab.Screen name="Earnings" component={EarningsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// Main Stack Navigator
const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={CustomerTabNavigator} />
    <Stack.Screen name="Emergency" component={EmergencyScreen} />
    <Stack.Screen name="Community" component={CommunityScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="BookingDetails" component={CustomerBookingDetails} />
    <Stack.Screen name="Payment" component={PaymentScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen name="Map" component={MapScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Help" component={HelpScreen} />
    <Stack.Screen name="About" component={AboutScreen} />
  </Stack.Navigator>
);

// Provider Stack Navigator
const ProviderStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProviderTabs" component={MechanicTabNavigator} />
    <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen name="Map" component={MapScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Help" component={HelpScreen} />
    <Stack.Screen name="About" component={AboutScreen} />
  </Stack.Navigator>
);

// Drawer Navigator
const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Drawer.Screen name="Main" component={MainStack} />
  </Drawer.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <AuthStack />;
  }

  // Route based on user role
  switch (user?.role) {
    case 'mechanic':
      return <ProviderStack />;
    case 'garage':
      return <ProviderStack />;
    case 'admin':
      return <ProviderStack />;
    default:
      return <DrawerNavigator />;
  }
};

export default AppNavigator;
