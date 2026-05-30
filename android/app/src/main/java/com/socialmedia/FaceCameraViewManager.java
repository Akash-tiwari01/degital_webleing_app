package com.socialmedia;

import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

/**
 * FaceCameraViewManager
 *
 * Bridges FaceCameraView (Java) to React Native's component system.
 * Registers the native component as "FaceCameraView" so it can be
 * accessed from TypeScript via requireNativeComponent('FaceCameraView').
 *
 * Props exposed to React Native:
 *   - role (string): "child" | "parent" | "family"
 *
 * Events emitted to React Native:
 *   - onFaceDetected: { detected: boolean, faceCount: number, role: string }
 */
public class FaceCameraViewManager extends SimpleViewManager<FaceCameraView> {

    public static final String REACT_CLASS = "FaceCameraView";

    // ─────────────────────────────────────────────────────────────────────────
    // Required overrides
    // ─────────────────────────────────────────────────────────────────────────

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @NonNull
    @Override
    protected FaceCameraView createViewInstance(@NonNull ThemedReactContext reactContext) {
        FaceCameraView view = new FaceCameraView(reactContext);
        // Start camera after the view has been created and attached
        view.post(view::startCamera);
        return view;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Props
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * role prop — determines the bounding box colour and label:
     *   "child"  -> purple ring (#A78BFA)
     *   "parent" -> blue ring   (#38BDF8)
     *   "family" -> cyan ring   (#22D3EE)
     */
    @ReactProp(name = "role")
    public void setRole(FaceCameraView view, @Nullable String role) {
        view.setRole(role);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────────────────────────────────

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put(
                "onFaceDetected",
                MapBuilder.of(
                    "phasedRegistrationNames",
                    MapBuilder.of(
                        "bubbled",   "onFaceDetected",
                        "captured",  "onFaceDetectedCapture"
                    )
                )
            )
            .build();
    }
}
