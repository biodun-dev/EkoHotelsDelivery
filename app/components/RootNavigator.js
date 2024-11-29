import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import metrics from "../utils/metrics";
import SideBar from "./SideBar";

// Import your screens
import AboutStoreContainer from "../containers/AboutStoreContainer";
import AddressListContainer from "../containers/AddressListContainer";
import AddressMapContainer from "../containers/AddressMapContainer";
import BookingAvailabilityContainer from "../containers/BookingAvailabilityContainer";
import BookingSuccessContainer from "../containers/BookingSuccessContainer";
import CartContainer from "../containers/CartContainer";
import CategoryDetailContainer from "../containers/CategoryDetailContainer";
import ChangePasswordContainer from "../containers/ChangePasswordContainer";
import CheckOutContainer from "../containers/CheckOutContainer";
import CMSContainer from "../containers/CMSContainer";
import ContactUsContainer from "../containers/ContactUsContainer";
import DetailedAddressListContainer from "../containers/DetailedAddressListContainer";
import EventBookContainer from "../containers/EventBookContainer";
import FAQsContainer from "../containers/FAQsContainer";
import FilterContainer from "../containers/FilterContainer";
import LoginContainer from "../containers/LoginContainer";
import MainContainer from "../containers/MainContainer";
import MyBookingContainer from "../containers/MyBookingContainer";
import MyOrderContainer from "../containers/MyOrderContainer";
import MyWalletContainer from "../containers/MyWalletContainer";
import NotificationList from "../containers/NotificationList";
import OrderConfirm from "../containers/OrderConfirm";
import OrderDetailContainer from "../containers/OrderDetailContainer";
import OTPVerification from "../containers/OTPVerification";
import PasswordRecoveryContainer from "../containers/PasswordRecoveryContainer";
import PaymentGatewayContainer from "../containers/PaymentGatewayContainer";
import PhoneNumberInput from "../containers/PhoneNumberInput";
import ProfileContainer from "../containers/ProfileContainer";
import PromoCode from "../containers/PromoCode";
import RecipeContainer from "../containers/RecipeContainer";
import RecipeDetail from "../containers/RecipeDetail";
import Restaurant from "../containers/Restaurant";
import ReviewsContainer from "../containers/ReviewsContainer";
import SavedCardsContainer from "../containers/SavedCardsContainer";
import SearchLocationContainer from "../containers/SearchLocationContainer";
import SignupContainer from "../containers/SignupContainer";
import SplashContainer from "../containers/SplashConainer";
import StripePaymentContainer from "../containers/StripePaymentContainer";
import TrackOrderContainer from "../containers/TrackOrderContainer";
import VacationContainer from "../containers/VacationContainer";
import LaundryContainer from "../containers/LaundryContainer";

// Create stack and drawer navigators
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Main Navigator
const MAIN_NAVIGATOR = () => (
  <Stack.Navigator initialRouteName="MainContainer" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainContainer" component={MainContainer} />
    <Stack.Screen name="SearchLocation" component={SearchLocationContainer} />
    <Stack.Screen name="RestaurantContainer" component={Restaurant} />
    <Stack.Screen name="AboutStore" component={AboutStoreContainer} />
    <Stack.Screen name="Reviews" component={ReviewsContainer} />
    <Stack.Screen name="RecipeDetail" component={RecipeDetail} />
    <Stack.Screen name="Profile" component={ProfileContainer} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordContainer} />
    <Stack.Screen name="Filter" component={FilterContainer} />
    <Stack.Screen name="Cart" component={CartContainer} />
    <Stack.Screen name="PromoCode" component={PromoCode} />
    <Stack.Screen name="AddressList" component={AddressListContainer} />
    <Stack.Screen name="OTPVerification" component={OTPVerification} />
    <Stack.Screen name="AddressMap" component={AddressMapContainer} />
    <Stack.Screen name="DetailedAddressList" component={DetailedAddressListContainer} />
    <Stack.Screen name="PaymentGateway" component={PaymentGatewayContainer} />
    <Stack.Screen name="CheckOut" component={CheckOutContainer} />
    <Stack.Screen name="OrderConfirm" component={OrderConfirm} />
  </Stack.Navigator>
);

// Recipe Navigator
const RECIPE_NAVIGATOR = () => (
  <Stack.Navigator initialRouteName="RecipeContainer" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="RecipeContainer" component={RecipeContainer} />
    <Stack.Screen name="CategoryDetail" component={CategoryDetailContainer} />
  </Stack.Navigator>
);

// Event Navigator
const EVENT_NAVIGATOR = () => (
  <Stack.Navigator initialRouteName="BookingAvailability" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BookingAvailability" component={BookingAvailabilityContainer} />
    <Stack.Screen name="EventBook" component={EventBookContainer} />
    <Stack.Screen name="BookingSuccess" component={BookingSuccessContainer} />
  </Stack.Navigator>
);

// My Booking Navigator
const MY_BOOKING_NAVIGATOR = () => (
  <Stack.Navigator initialRouteName="MyBookingContainer" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MyBookingContainer" component={MyBookingContainer} />
  </Stack.Navigator>
);

// My Order Navigator
const MY_ORDER_NAVIGATOR = () => (
  <Stack.Navigator initialRouteName="MyOrderContainer" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MyOrderContainer" component={MyOrderContainer} />
    <Stack.Screen name="TrackOrder" component={TrackOrderContainer} />
    <Stack.Screen name="OrderDetail" component={OrderDetailContainer} />
  </Stack.Navigator>
);

// Notification Navigator
const NOTIFICATION_NAVIGATOR = () => (
  <Stack.Navigator initialRouteName="NotificationList" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="NotificationList" component={NotificationList} />
  </Stack.Navigator>
);

// Wallet Navigator
const WALLET_NAVIGATOR = () => (
  <Stack.Navigator initialRouteName="MyWalletContainer" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MyWalletContainer" component={MyWalletContainer} />
    <Stack.Screen name="SavedCards" component={SavedCardsContainer} />
  </Stack.Navigator>
);

// Home Drawer Navigator
const HOME_SCREEN_DRAWER = () => (
  <Drawer.Navigator
    initialRouteName="Home"
    drawerContent={(props) => <SideBar {...props} />}
    screenOptions={{ drawerStyle: { width: metrics.screenWidth * 0.66 } }}
  >
    <Drawer.Screen name="Main" component={MAIN_NAVIGATOR} />
    <Drawer.Screen name="Wallet" component={WALLET_NAVIGATOR} />
    <Drawer.Screen name="Recipe" component={RECIPE_NAVIGATOR} />
    <Drawer.Screen name="Event" component={EVENT_NAVIGATOR} />
    <Drawer.Screen name="MyBooking" component={MY_BOOKING_NAVIGATOR} />
    <Drawer.Screen name="Notifications" component={NOTIFICATION_NAVIGATOR} />
    <Drawer.Screen name="Orders" component={MY_ORDER_NAVIGATOR} />
    <Drawer.Screen name="CMS" component={CMSContainer} />
    <Drawer.Screen name="ContactUs" component={ContactUsContainer} />
    <Drawer.Screen name="FAQs" component={FAQsContainer} />
  </Drawer.Navigator>
);

// Base Stack Navigator
const BASE_STACK_NAVIGATOR = () => (
  <Stack.Navigator initialRouteName="SplashContainer" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SplashContainer" component={SplashContainer} />
    <Stack.Screen name="Login" component={LoginContainer} />
    <Stack.Screen name="Signup" component={SignupContainer} />
    <Stack.Screen name="Home" component={HOME_SCREEN_DRAWER} />
  </Stack.Navigator>
);

// Base Navigator
const BASE_NAVIGATOR = () => (
  <NavigationContainer>
    <BASE_STACK_NAVIGATOR />
  </NavigationContainer>
);

export default BASE_NAVIGATOR;
