package com.socialmedia;

import android.app.AppOpsManager;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Process;
import android.provider.Settings;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.Calendar;
import java.util.List;
import java.util.Map;

public class DigitalWellbeingModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "DigitalWellbeingModule";

    public DigitalWellbeingModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void checkUsagePermission(Promise promise) {
        Context context = getReactApplicationContext();
        AppOpsManager appOps = (AppOpsManager) context.getSystemService(Context.APP_OPS_SERVICE);
        if (appOps == null) {
            promise.resolve(false);
            return;
        }
        int mode = appOps.checkOpNoThrow(
            AppOpsManager.OPSTR_GET_USAGE_STATS,
            Process.myUid(),
            context.getPackageName()
        );
        promise.resolve(mode == AppOpsManager.MODE_ALLOWED);
    }

    @ReactMethod
    public void openUsageSettings() {
        Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getReactApplicationContext().startActivity(intent);
    }

    @ReactMethod
    public void getAppsUsageStats(Promise promise) {
        try {
            Context context = getReactApplicationContext();
            UsageStatsManager usm = (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);
            if (usm == null) {
                promise.reject("ERROR", "UsageStatsManager is not available.");
                return;
            }

            Calendar calendar = Calendar.getInstance();
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);
            long startTime = calendar.getTimeInMillis();
            long endTime = System.currentTimeMillis();

            List<UsageStats> usageStatsList = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, endTime);
            WritableArray appList = Arguments.createArray();

            PackageManager pm = context.getPackageManager();
            if (usageStatsList != null) {
                for (UsageStats usageStats : usageStatsList) {
                    long totalTime = usageStats.getTotalTimeInForeground();
                    if (totalTime > 0) {
                        String packageName = usageStats.getPackageName();
                        String appName = packageName;
                        try {
                            ApplicationInfo ai = pm.getApplicationInfo(packageName, 0);
                            // Skip system applications that have no launcher category
                            if (pm.getLaunchIntentForPackage(packageName) == null) {
                                continue;
                            }
                            appName = pm.getApplicationLabel(ai).toString();
                            
                            WritableMap appMap = Arguments.createMap();
                            appMap.putString("packageName", packageName);
                            appMap.putString("appName", appName);
                            appMap.putDouble("usageTimeMs", totalTime);
                            appList.pushMap(appMap);
                        } catch (PackageManager.NameNotFoundException ignored) {
                            // Package not installed
                        }
                    }
                }
            }
            promise.resolve(appList);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void setAppLimits(ReadableMap limits, Promise promise) {
        try {
            SharedPreferences prefs = getReactApplicationContext().getSharedPreferences("WellbeingPrefs", Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = prefs.edit();
            
            // Clear existing limits first
            Map<String, ?> allEntries = prefs.getAll();
            for (Map.Entry<String, ?> entry : allEntries.entrySet()) {
                if (entry.getKey().endsWith("_limit")) {
                    editor.remove(entry.getKey());
                }
            }

            ReadableMapKeySetIterator iterator = limits.keySetIterator();
            while (iterator.hasNextKey()) {
                String packageName = iterator.nextKey();
                int limitMinutes = limits.getInt(packageName);
                editor.putInt(packageName + "_limit", limitMinutes);
            }
            editor.apply();
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getAppLimits(Promise promise) {
        try {
            SharedPreferences prefs = getReactApplicationContext().getSharedPreferences("WellbeingPrefs", Context.MODE_PRIVATE);
            WritableMap limitsMap = Arguments.createMap();
            Map<String, ?> allEntries = prefs.getAll();
            for (Map.Entry<String, ?> entry : allEntries.entrySet()) {
                if (entry.getKey().endsWith("_limit")) {
                    String pkg = entry.getKey().substring(0, entry.getKey().length() - 6);
                    limitsMap.putInt(pkg, (Integer) entry.getValue());
                }
            }
            promise.resolve(limitsMap);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void startUsageMonitoringService(Promise promise) {
        try {
            Context context = getReactApplicationContext();
            Intent intent = new Intent(context, UsageMonitoringService.class);
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                context.startForegroundService(intent);
            } else {
                context.startService(intent);
            }
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void stopUsageMonitoringService(Promise promise) {
        try {
            Context context = getReactApplicationContext();
            Intent intent = new Intent(context, UsageMonitoringService.class);
            context.stopService(intent);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getLaunchBlockedApp(Promise promise) {
        android.app.Activity activity = getCurrentActivity();
        if (activity != null && activity.getIntent() != null) {
            Intent intent = activity.getIntent();
            if (intent.hasExtra("blocked_app")) {
                String blockedApp = intent.getStringExtra("blocked_app");
                intent.removeExtra("blocked_app");
                promise.resolve(blockedApp);
                return;
            }
        }
        promise.resolve(null);
    }
}
