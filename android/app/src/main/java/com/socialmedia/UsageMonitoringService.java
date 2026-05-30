package com.socialmedia;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;
import android.widget.Toast;

import androidx.core.app.NotificationCompat;

import java.util.Calendar;
import java.util.List;
import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;

public class UsageMonitoringService extends Service {
    private static final String TAG = "UsageMonitoringService";
    private static final String CHANNEL_ID = "DigitalWellbeingChannel";
    private static final int NOTIFICATION_ID = 9988;
    
    private Handler mHandler;
    private Runnable mRunnable;
    private static final long CHECK_INTERVAL = 5000; // Check every 5 seconds
    
    @Override
    public void onCreate() {
        super.onCreate();
        mHandler = new Handler(Looper.getMainLooper());
        createNotificationChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // Start Foreground Service to keep it alive
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
            this, 0, notificationIntent,
            PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT
        );

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Digital Wellbeing Active")
            .setContentText("Monitoring app usage limits...")
            .setSmallIcon(android.R.drawable.ic_lock_lock)
            .setContentIntent(pendingIntent)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setOngoing(true)
            .build();

        startForeground(NOTIFICATION_ID, notification);
        
        startMonitoring();
        return START_STICKY;
    }

    private void startMonitoring() {
        if (mRunnable != null) {
            mHandler.removeCallbacks(mRunnable);
        }
        mRunnable = new Runnable() {
            @Override
            public void run() {
                try {
                    checkUsageAndEnforceLimits();
                } catch (Exception e) {
                    Log.e(TAG, "Error checking limits: " + e.getMessage());
                }
                mHandler.postDelayed(this, CHECK_INTERVAL);
            }
        };
        mHandler.post(mRunnable);
    }

    private void checkUsageAndEnforceLimits() {
        String foregroundApp = getForegroundApp();
        if (foregroundApp == null || foregroundApp.isEmpty()) {
            return;
        }

        // Exclude our own app from being blocked
        if (foregroundApp.equals(getPackageName())) {
            return;
        }

        // Fetch limits from shared preferences
        SharedPreferences prefs = getSharedPreferences("WellbeingPrefs", Context.MODE_PRIVATE);
        int limitMinutes = prefs.getInt(foregroundApp + "_limit", -1);
        
        if (limitMinutes > 0) {
            long usageMs = getTodayUsageMs(foregroundApp);
            long limitMs = limitMinutes * 60 * 1000L;
            
            if (usageMs >= limitMs) {
                Log.d(TAG, "Limit exceeded for " + foregroundApp + ": " + usageMs + "ms vs " + limitMs + "ms");
                triggerLimitExceeded(foregroundApp);
            } else if (limitMs - usageMs <= 5 * 60 * 1000L) {
                // Warning if within 5 minutes (300,000 ms) and not warned in the last 1 hour
                long lastWarned = prefs.getLong(foregroundApp + "_last_warn", 0);
                long now = System.currentTimeMillis();
                if (now - lastWarned > 60 * 60 * 1000L) {
                    showWarningNotification(foregroundApp);
                    prefs.edit().putLong(foregroundApp + "_last_warn", now).apply();
                }
            }
        }
    }

    private String getForegroundApp() {
        UsageStatsManager usm = (UsageStatsManager) getSystemService(Context.USAGE_STATS_SERVICE);
        if (usm == null) return null;
        
        long time = System.currentTimeMillis();
        List<UsageStats> appList = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, time - 1000 * 30, time);
        if (appList != null && !appList.isEmpty()) {
            SortedMap<Long, UsageStats> mySortedMap = new TreeMap<>();
            for (UsageStats usageStats : appList) {
                mySortedMap.put(usageStats.getLastTimeUsed(), usageStats);
            }
            if (!mySortedMap.isEmpty()) {
                return mySortedMap.get(mySortedMap.lastKey()).getPackageName();
            }
        }
        return null;
    }

    private long getTodayUsageMs(String packageName) {
        UsageStatsManager usm = (UsageStatsManager) getSystemService(Context.USAGE_STATS_SERVICE);
        if (usm == null) return 0;

        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        long startTime = calendar.getTimeInMillis();
        long endTime = System.currentTimeMillis();

        List<UsageStats> usageStatsList = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, endTime);
        if (usageStatsList != null) {
            for (UsageStats usageStats : usageStatsList) {
                if (usageStats.getPackageName().equals(packageName)) {
                    return usageStats.getTotalTimeInForeground();
                }
            }
        }
        return 0;
    }

    private void triggerLimitExceeded(String packageName) {
        mHandler.post(() -> {
            Toast.makeText(getApplicationContext(), getAppName(packageName) + " limit reached!", Toast.LENGTH_LONG).show();
        });

        // 1. Show local notification
        showNotification("Daily Limit Reached", getAppName(packageName) + " usage limit has been exceeded for today.");

        // 2. Launch system Home screen (to exit the limited app)
        Intent homeIntent = new Intent(Intent.ACTION_MAIN);
        homeIntent.addCategory(Intent.CATEGORY_HOME);
        homeIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(homeIntent);
        
        // 3. Open our app on a daily limit screen or main activity with intent params
        Intent blockIntent = new Intent(this, MainActivity.class);
        blockIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        blockIntent.putExtra("blocked_app", getAppName(packageName));
        startActivity(blockIntent);
    }

    private void showWarningNotification(String packageName) {
        showNotification("Warning: Limit Approaching", getAppName(packageName) + " has less than 5 minutes of usage remaining today.");
    }

    private void showNotification(String title, String message) {
        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager == null) return;

        Intent intent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
            this, 1, intent,
            PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT
        );

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setContentTitle(title)
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setDefaults(NotificationCompat.DEFAULT_ALL)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true);

        manager.notify((int) System.currentTimeMillis(), builder.build());
    }

    private String getAppName(String packageName) {
        PackageManager pm = getPackageManager();
        try {
            ApplicationInfo ai = pm.getApplicationInfo(packageName, 0);
            return pm.getApplicationLabel(ai).toString();
        } catch (Exception e) {
            return packageName;
        }
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                CHANNEL_ID,
                "Digital Wellbeing Monitoring Channel",
                NotificationManager.IMPORTANCE_HIGH
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(serviceChannel);
            }
        }
    }

    @Override
    public void onDestroy() {
        if (mHandler != null && mRunnable != null) {
            mHandler.removeCallbacks(mRunnable);
        }
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
