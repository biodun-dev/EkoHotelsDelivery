import AsyncStorage from '@react-native-async-storage/async-storage';
import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';
import { firebase } from '@react-native-firebase/app';
import i18n from 'i18n-js';
import React from "react";
import { AppState, Linking, LogBox, Platform, StatusBar, Text, TextInput, View } from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import KeyboardManager from 'react-native-keyboard-manager';
import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import EDCustomAlert from './app/components/EDCustomAlert';
import { BASE_NAVIGATOR } from "./app/components/RootNavigator";
import { setI18nConfig, strings } from "./app/locales/i18n";
import { saveAlertData, savePromptStatus, saveWalletMoneyInRedux } from "./app/redux/actions/User";
import { checkoutDetailOperation } from "./app/redux/reducers/CheckoutReducer";
import { navigationOperation } from "./app/redux/reducers/NavigationReducer";
import { userOperations } from "./app/redux/reducers/UserReducer";
import { getLanguage } from './app/utils/AsyncStorageHelper';
import { showDialogue } from "./app/utils/EDAlert";
import { EDColors } from "./app/utils/EDColors";
import {
    debugLog, DEFAULT_TYPE,

    DINE_TYPE,

    EVENT_TYPE, NOTIFICATION_TYPE,

    ORDER_TYPE
} from "./app/utils/EDConstants";
import NavigationService from "./NavigationService.js";
const rootReducer = combineReducers({
    userOperations: userOperations,
    navigationReducer: navigationOperation,
    checkoutReducer: checkoutDetailOperation
});

export const globalStore = createStore(rootReducer);


const exceptionhandler = (error, isFatal) => {
    if (error && error.stack) {
        console.error("JS ERROR ::::", error);
        console.error("Stack Trace:", error.stack);

        // Safely use strings
        const errorMsg = i18n.translations ? strings("exceptionMsg") : "An error occurred";
        showDialogue(errorMsg);

        crashlytics().log(error.message);
        crashlytics().recordError(error);
    }
};


setJSExceptionHandler(exceptionhandler, true);

setNativeExceptionHandler(exceptionString => {
    showDialogue(strings("exceptionMsg"))
    crashlytics().log(exceptionString)
    crashlytics().recordError(exceptionString)
});


if (!firebase.apps.length) {
    firebase.initializeApp();
}
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.isNotification = undefined;
        console.disableYellowBox = true
        Text.defaultProps = TextInput.defaultProps || {};
        Text.defaultProps.allowFontScaling = false;
        TextInput.defaultProps = TextInput.defaultProps || {};
        TextInput.defaultProps.allowFontScaling = false;
    }

    state = {
        isRefresh: false,
        key: 1,
        appState: AppState.currentState
    };


    async checkPermission() {
        const enabled = await messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    async getToken() {
        fcmToken = await messaging().getToken();
    }

    async requestPermission() {
        try {
            await messaging().requestPermission();
            this.getToken();
        } catch (error) {
        }
    }

    async createNotificationListeners() {
        messaging().onMessage(async remoteMessage => {
            let currentRoute = NavigationService.getCurrentRoute().routeName
            debugLog("CURRENT ROUTE ::::", NavigationService.getCurrentRoute())
            showDialogue(remoteMessage.notification.body, [], remoteMessage.notification.title,
                () => {
                    if (remoteMessage.data !== undefined && remoteMessage.data !== null && remoteMessage.data.screenType !== undefined) {

                        if (remoteMessage.data.screenType === "order") {
                            if (remoteMessage.data.wallet_amount !== undefined &&
                                remoteMessage.data.wallet_amount !== null &&
                                remoteMessage.data.wallet_amount !== ""
                            ) {
                                globalStore.dispatch(
                                    saveWalletMoneyInRedux(remoteMessage.data.wallet_amount)
                                )
                            }
                            if (currentRoute == "MyOrderContainer") {
                                this.setState({ key: this.state.key + 1 })
                            }
                            else
                                NavigationService.navigateToSpecificRoute("Order")
                        } else if (remoteMessage.data.screenType === "noti") {
                            if (currentRoute == "NotificationContainer") {
                                this.setState({ key: this.state.key + 1 })
                            }
                            else
                                NavigationService.navigateToSpecificRoute("Notification");
                        } else if (remoteMessage.data.screenType === "dinein") {
                            if (currentRoute == "PendingOrdersFromCart") {
                                this.setState({ key: this.state.key + 1 })
                            }
                            else
                                NavigationService.navigateToSpecificRoute("PendingOrders")
                        } else if (remoteMessage.data.screenType === "delivery") {
                            AsyncStorage.setItem('ratingData', remoteMessage.data.order_id);
                            if (currentRoute == "MyOrderContainer") {
                                this.setState({ key: this.state.key + 1 })
                            }
                            else {
                                NavigationService.navigateToSpecificRoute("Order")
                            }
                        } else if (remoteMessage.data.screenType === "event" || remoteMessage.data.screenType === "table") {
                            if (currentRoute == "MyBookingContainer") {
                                this.setState({ key: this.state.key + 1 })
                            }
                            else
                                NavigationService.navigateToSpecificRoute("MyBookingContainer")
                        }
                    }
                })
            debugLog("Foreground message ::::::", remoteMessage)
        });

        this.messageListener = messaging().onNotificationOpenedApp(remoteMessage => {
            let currentRoute = NavigationService.getCurrentRoute().routeName
            debugLog(
                'Notification caused app to open from background state:',
                remoteMessage,
            );
            if (remoteMessage.data !== undefined && remoteMessage.data !== null && remoteMessage.data.screenType !== undefined) {

                if (remoteMessage.data.screenType === "order") {
                    if (remoteMessage.data.wallet_amount !== undefined &&
                        remoteMessage.data.wallet_amount !== null &&
                        remoteMessage.data.wallet_amount !== ""
                    ) {
                        globalStore.dispatch(
                            saveWalletMoneyInRedux(remoteMessage.data.wallet_amount)
                        )
                    }
                    if (currentRoute == "MyOrderContainer") {
                        this.setState({ key: this.state.key + 1 })
                    }
                    else
                        NavigationService.navigateToSpecificRoute("Order")
                } else if (remoteMessage.data.screenType === "noti") {
                    if (currentRoute == "NotificationContainer") {
                        this.setState({ key: this.state.key + 1 })
                    }
                    else
                        NavigationService.navigateToSpecificRoute("Notification");
                } else if (remoteMessage.data.screenType === "dinein") {
                    if (currentRoute == "PendingOrdersFromCart") {
                        this.setState({ key: this.state.key + 1 })
                    }
                    else
                        NavigationService.navigateToSpecificRoute("PendingOrders")
                } else if (remoteMessage.data.screenType === "delivery") {
                    AsyncStorage.setItem('ratingData', remoteMessage.data.order_id);
                    if (currentRoute == "MyOrderContainer") {
                        this.setState({ key: this.state.key + 1 })
                    }
                    else {
                        NavigationService.navigateToSpecificRoute("Order")
                    }

                } else if (remoteMessage.data.screenType === "event" || remoteMessage.data.screenType === "table") {
                    if (currentRoute == "MyBookingContainer") {
                        this.setState({ key: this.state.key + 1 })
                    }
                    else
                        NavigationService.navigateToSpecificRoute("MyBookingContainer")
                }
            }
        });


        await messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    debugLog("NOTIFICATION FROM SLEEP ::::", remoteMessage)
                    const lastNotification = AsyncStorage.getItem("lastNotification");

                    if (lastNotification !== remoteMessage.messageId) {
                        if (remoteMessage.data !== undefined && remoteMessage.data !== null && remoteMessage.data.screenType !== undefined) {
                            if (remoteMessage.data.screenType === "order") {
                                this.isNotification = ORDER_TYPE;
                                this.setState({ isRefresh: this.state.isRefresh ? false : true });
                            } else if (remoteMessage.data.screenType === "noti") {
                                this.isNotification = NOTIFICATION_TYPE;
                                this.setState({ isRefresh: this.state.isRefresh ? false : true });
                            } else if (remoteMessage.data.screenType === "delivery") {
                                AsyncStorage.setItem('ratingData', remoteMessage.data.order_id)
                                this.isNotification = ORDER_TYPE;
                                this.setState({ isRefresh: this.state.isRefresh ? false : true });
                            } else if (remoteMessage.data.screenType === "event" || remoteMessage.data.screenType === "table") {
                                this.isNotification = EVENT_TYPE;
                                this.setState({ isRefresh: this.state.isRefresh ? false : true });
                            }
                            else if (remoteMessage.data.screenType === "dinein") {
                                this.isNotification = DINE_TYPE;
                                this.setState({ isRefresh: this.state.isRefresh ? false : true });
                            }
                        }
                        AsyncStorage.setItem("lastNotification", remoteMessage.messageId);
                    }
                }
            });
        debugLog("LAST NOTIFICATION :::::", await AsyncStorage.getItem("lastNotification"))
        if (this.isNotification == undefined) {
            this.isNotification = DEFAULT_TYPE;
            this.setState({ isRefresh: this.state.isRefresh ? false : true });
        }
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState == "active") {
            if (this.messageListener !== undefined)
                this.messageListener()
        }
        if (nextAppState === 'active') {
            globalStore.dispatch(
                saveAlertData(undefined)
            )
            globalStore.dispatch(
                savePromptStatus(false)
            )
        }
        this.setState({ appState: nextAppState });
    }

    async saveLanguage() {
        await getLanguage(
            async (success) => {
                let lan = success;
                if (lan) {
                    i18n.locale = lan;
                    await setI18nConfig(lan); // Ensure translations are set
                } else {
                    lan = "en";
                    i18n.locale = "en";
                    await setI18nConfig("en"); // Default to English
                }
            },
            (failure) => {
                console.error("Error fetching saved language:", failure);
            }
        );
    }
    
    //#endregion
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    async componentDidMount() {
        console.log("Initial isNotification:", this.isNotification);
        AppState.addEventListener("change", this._handleAppStateChange);
    
        try {
            // Ensure default language setup
            await setI18nConfig();
            console.log(`Locale initialized to: ${i18n.locale}`);
        } catch (error) {
            console.error("Error initializing i18n config:", error);
        }
    
        setTimeout(() => {
            globalStore.dispatch(savePromptStatus(false));
        }, 2000);
    
        this.createNotificationListeners();
    
        if (Platform.OS === "ios") {
            KeyboardManager.setEnable(true);
            KeyboardManager.setEnableDebugging(false);
            KeyboardManager.setKeyboardDistanceFromTextField(20);
            KeyboardManager.setEnableAutoToolbar(true);
            KeyboardManager.setToolbarDoneBarButtonItemText("Done");
            KeyboardManager.setToolbarPreviousNextButtonEnable(true);
            KeyboardManager.setShouldToolbarUsesTextFieldTintColor(true);
            KeyboardManager.setShouldShowToolbarPlaceholder(true);
            KeyboardManager.setOverrideKeyboardAppearance(true);
            KeyboardManager.setShouldResignOnTouchOutside(true);
        }
    
        if (!__DEV__) console.log = () => null;
    
        LogBox.ignoreAllLogs();
    
        this.checkPermission();
        this.createNotificationListeners();
    
        this.unsubscribe = globalStore.subscribe(this.checkForUpdates);
    }
    


    updateFromStore = (app_link, is_forced = false) => {
        if (app_link !== undefined && app_link !== null && app_link.trim().length !== null) {
            if (Linking.canOpenURL(app_link)) {
                Linking.openURL(app_link).then(() => {
                    globalStore.dispatch(
                        saveAlertData(undefined)
                    )
                    if (is_forced)
                        globalStore.dispatch(
                            savePromptStatus(false)
                        )
                }
                ).catch(
                    () => {
                    }
                )
            }
            else {

            }
        }
    }


    checkForUpdates = () => {

        let appVersion = globalStore.getState().userOperations.appVersion
        let isPrompted = globalStore.getState().userOperations.updatePrompt
        if (appVersion !== undefined && appVersion.app_live_version !== undefined) {
            let currentVersion = deviceInfoModule.getVersion()



            if (!isPrompted) {
                if (parseFloat(currentVersion) < parseFloat(appVersion.app_live_version)) {
                    globalStore.dispatch(
                        savePromptStatus(true)
                    )
                    if (parseFloat(currentVersion) < parseFloat(appVersion.app_force_version)) {
                        showDialogue(
                            strings('forceUpdate'),
                            [],
                            strings('appName'),
                            () => { this.updateFromStore(appVersion.app_url, true) },
                            strings('updateApp'),

                        );
                    }
                    else {
                        showDialogue(
                            strings('updateAppMsg'),
                            [{
                                text: strings('dialogCancel'), onPress: () => {

                                },
                                isNotPreferred: true,
                                buttonColor: EDColors.offWhite
                            }],
                            strings('appName'),
                            () => { this.updateFromStore(appVersion.app_url) },
                            strings('updateApp'),

                        );
                    }
                }
                else {
                    globalStore.dispatch(
                        savePromptStatus(true)
                    )
                    globalStore.dispatch(
                        saveAlertData(undefined)
                    )
                    this.unsubscribe()
                }
            }
        }
    }


    render() {
        try {
            return (
                <Provider store={globalStore}>
                    <StatusBar backgroundColor={EDColors.primary} barStyle={'light-content'} />
                    <BASE_NAVIGATOR
                        ref={(navigatorRef) => {
                            NavigationService.setTopLevelNavigator(navigatorRef);
                        }}
                        screenProps={{
                            notificationSlug: this.isNotification,
                            isRefresh: this.state.key,
                        }}
                    />
                    <EDCustomAlert />
                </Provider>
            );
        } catch (error) {
            console.error("Render Error:", error);
            return <View><Text>Something went wrong</Text></View>;
        }
    }


}
