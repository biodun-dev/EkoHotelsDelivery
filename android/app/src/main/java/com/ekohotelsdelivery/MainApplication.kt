package com.ekohotelsdelivery

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
import com.google.firebase.FirebaseApp
import com.google.firebase.crashlytics.FirebaseCrashlytics
import com.facebook.FacebookSdk
import com.facebook.appevents.AppEventsLogger
import com.facebook.react.ReactPackage

class MainApplication : Application(), ReactApplication {

    override val reactNativeHost: ReactNativeHost =
        object : DefaultReactNativeHost(this) {
            override fun getPackages(): List<ReactPackage> =
                PackageList(this).packages.apply {
                    // Add any manually linked packages here, if required
                    // Example: add(YourCustomPackage())
                }

            override fun getJSMainModuleName(): String = "index"

            override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

            override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
            override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
        }

    override fun onCreate() {
        super.onCreate()

        // Initialize SoLoader without OpenSourceMergedSoMapping
        SoLoader.init(this, /* native exopackage */ false)

        // Enable New Architecture if opted-in
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // Only load new architecture components if enabled
            com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load()
        }

        // Initialize Firebase
        FirebaseApp.initializeApp(this)

        // Enable Crashlytics (conditionally disable in debug mode)
        FirebaseCrashlytics.getInstance().setCrashlyticsCollectionEnabled(!BuildConfig.DEBUG)

        // Initialize Facebook SDK
        FacebookSdk.sdkInitialize(applicationContext)
        AppEventsLogger.activateApp(this)
    }
}
