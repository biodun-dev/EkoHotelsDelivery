import AsyncStorage from '@react-native-async-storage/async-storage';
import crashlytics from '@react-native-firebase/crashlytics';
import { firebase } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import i18n from 'i18n-js';
import React, { useEffect, useRef, useState } from "react";
import { AppState, Linking, LogBox, Platform, StatusBar, Text, TextInput } from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import KeyboardManager from 'react-native-keyboard-manager';
import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import EDCustomAlert from './app/components/EDCustomAlert';
import BASE_NAVIGATOR from "./app/components/RootNavigator"; // Modernized BASE_NAVIGATOR

import { setI18nConfig, strings } from "./app/locales/i18n";
import { saveAlertData, savePromptStatus, saveWalletMoneyInRedux } from "./app/redux/actions/User";
import { checkoutDetailOperation } from "./app/redux/reducers/CheckoutReducer";
import { navigationOperation } from "./app/redux/reducers/NavigationReducer";
import { userOperations } from "./app/redux/reducers/UserReducer";
import { getLanguage } from './app/utils/AsyncStorageHelper';
import { showDialogue } from "./app/utils/EDAlert";
import { EDColors } from "./app/utils/EDColors";
import NavigationService from "./NavigationService";

const rootReducer = combineReducers({
    userOperations,
    navigationReducer: navigationOperation,
    checkoutReducer: checkoutDetailOperation,
});

export const globalStore = createStore(rootReducer);

// Handle JS exceptions
const exceptionhandler = (error, isFatal) => {
    if (error?.stack) {
        console.error("JS ERROR ::::", error);
        console.error("Stack Trace:", error.stack);

        const errorMsg = i18n.translations ? strings("exceptionMsg") : "An error occurred";
        showDialogue(errorMsg);

        crashlytics().log(error.message);
        crashlytics().recordError(error);
    }
};
setJSExceptionHandler(exceptionhandler, true);

// Handle native exceptions
setNativeExceptionHandler((exceptionString) => {
    showDialogue(strings("exceptionMsg"));
    crashlytics().log(exceptionString);
    crashlytics().recordError(exceptionString);
});

if (!firebase.apps.length) {
    firebase.initializeApp();
}

const App = () => {
    const [isRefresh, setIsRefresh] = useState(false);
    const [key, setKey] = useState(1);
    const [appState, setAppState] = useState(AppState.currentState);
    const isNotification = useRef(undefined);

    const checkPermission = async () => {
        const enabled = await messaging().hasPermission();
        if (enabled) {
            getToken();
        } else {
            requestPermission();
        }
    };

    const getToken = async () => {
        const fcmToken = await messaging().getToken();
        // Handle FCM Token if needed
    };

    const requestPermission = async () => {
        try {
            await messaging().requestPermission();
            getToken();
        } catch (error) {
            console.error("Permission rejected", error);
        }
    };

    const createNotificationListeners = async () => {
        messaging().onMessage(async (remoteMessage) => {
            const currentRoute = NavigationService.getCurrentRoute()?.routeName;
            showDialogue(remoteMessage.notification.body, [], remoteMessage.notification.title, () => {
                // Handle notification redirection logic
            });
        });

        messaging().onNotificationOpenedApp((remoteMessage) => {
            const currentRoute = NavigationService.getCurrentRoute()?.routeName;
            // Handle navigation based on notification
        });

        const initialNotification = await messaging().getInitialNotification();
        if (initialNotification) {
            // Handle notification from a killed state
        }
    };

    const saveLanguage = async () => {
        await getLanguage(
            (success) => {
                const lan = success || "en";
                i18n.locale = lan;
                setI18nConfig(lan);
            },
            (failure) => {
                console.error("Language fetch error", failure);
            }
        );
    };

    useEffect(() => {
        AppState.addEventListener('change', setAppState);

        saveLanguage();
        setTimeout(() => globalStore.dispatch(savePromptStatus(false)), 2000);
        createNotificationListeners();

        if (Platform.OS === 'ios') {
            KeyboardManager.setEnable(true);
            KeyboardManager.setEnableDebugging(false);
            KeyboardManager.setKeyboardDistanceFromTextField(20);
            KeyboardManager.setEnableAutoToolbar(true);
            KeyboardManager.setToolbarDoneBarButtonItemText('Done');
            KeyboardManager.setToolbarPreviousNextButtonEnable(true);
            KeyboardManager.setShouldToolbarUsesTextFieldTintColor(true);
            KeyboardManager.setShouldShowToolbarPlaceholder(true);
            KeyboardManager.setOverrideKeyboardAppearance(true);
            KeyboardManager.setShouldResignOnTouchOutside(true);
        }

        LogBox.ignoreAllLogs();
        checkPermission();

        const unsubscribe = globalStore.subscribe(() => {
            // Check for app updates or changes
        });

        return () => {
            AppState.removeEventListener('change', setAppState);
            unsubscribe();
        };
    }, []);

    return (
        <Provider store={globalStore}>
            <StatusBar backgroundColor={EDColors.primary} barStyle="light-content" />
            <BASE_NAVIGATOR
                ref={(navigatorRef) => NavigationService.setTopLevelNavigator(navigatorRef)}
                screenProps={{ notificationSlug: isNotification.current, isRefresh: key }}
            />
            <EDCustomAlert />
        </Provider>
    );
};

export default App;
