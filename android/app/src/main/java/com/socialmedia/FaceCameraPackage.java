package com.socialmedia;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * FaceCameraPackage
 *
 * ReactPackage that registers FaceCameraViewManager so that React Native
 * auto-linking / manual registration can find our native view.
 *
 * Register this in MainApplication.kt → getPackages() / PackageList.
 */
public class FaceCameraPackage implements ReactPackage {

    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        // No plain NativeModules — only a ViewManager
        return Collections.emptyList();
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(new FaceCameraViewManager());
    }
}
