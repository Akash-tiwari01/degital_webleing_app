package com.socialmedia;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewOutlineProvider;
import android.graphics.Outline;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;
import androidx.annotation.OptIn;
import androidx.camera.core.Camera;
import androidx.camera.core.CameraSelector;
import androidx.camera.core.ExperimentalGetImage;
import androidx.camera.core.ImageAnalysis;
import androidx.camera.core.ImageProxy;
import androidx.camera.core.Preview;
import androidx.camera.lifecycle.ProcessCameraProvider;
import androidx.camera.view.PreviewView;
import androidx.core.content.ContextCompat;
import androidx.lifecycle.Lifecycle;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.LifecycleRegistry;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.common.util.concurrent.ListenableFuture;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.face.Face;
import com.google.mlkit.vision.face.FaceDetection;
import com.google.mlkit.vision.face.FaceDetector;
import com.google.mlkit.vision.face.FaceDetectorOptions;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * FaceCameraView
 *
 * A native Android view that:
 * 1. Opens the front-facing camera using CameraX
 * 2. Runs Google ML Kit Face Detection on every frame
 * 3. Draws coloured bounding boxes around detected faces
 * 4. Sends a React Native event (onFaceDetected) when faces are found/lost
 *
 * Role colours:
 *  child  -> purple  (#A78BFA)
 *  parent -> blue    (#38BDF8)
 *  family -> cyan    (#22D3EE)  [default]
 */
public class FaceCameraView extends FrameLayout implements LifecycleOwner, LifecycleEventListener {

    private final LifecycleRegistry mLifecycleRegistry = new LifecycleRegistry(this);

    // ── Constants ────────────────────────────────────────────────────────────
    private static final String ROLE_CHILD  = "child";
    private static final String ROLE_PARENT = "parent";

    // ── State ─────────────────────────────────────────────────────────────────
    private String mRole = "family";
    private List<RectF> mFaceBounds = new ArrayList<>();
    private boolean mFaceDetected = false;
    private boolean mCameraStarted = false;
    private int mPreviewWidth  = 0;
    private int mPreviewHeight = 0;

    // ── Camera / ML ───────────────────────────────────────────────────────────
    private PreviewView      mPreviewView;
    private FaceDetector     mFaceDetector;
    private ExecutorService  mCameraExecutor;
    private Camera           mCamera;

    // ── Paint ─────────────────────────────────────────────────────────────────
    private final Paint mBoxPaint   = new Paint();
    private final Paint mLabelPaint = new Paint();

    // ─────────────────────────────────────────────────────────────────────────
    // Constructors
    // ─────────────────────────────────────────────────────────────────────────

    public FaceCameraView(Context context) {
        super(context);
        init();
    }

    public FaceCameraView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Initialisation
    // ─────────────────────────────────────────────────────────────────────────

    private void init() {
        setWillNotDraw(false); // allow onDraw to be called on this ViewGroup

        // Initialize lifecycle registry state
        mLifecycleRegistry.setCurrentState(Lifecycle.State.INITIALIZED);

        // Add lifecycle event listener to ReactContext
        if (getContext() instanceof ReactContext) {
            ((ReactContext) getContext()).addLifecycleEventListener(this);
        } else if (getContext() instanceof android.content.ContextWrapper) {
            Context baseCtx = ((android.content.ContextWrapper) getContext()).getBaseContext();
            if (baseCtx instanceof ReactContext) {
                ((ReactContext) baseCtx).addLifecycleEventListener(this);
            }
        }

        // Clip to circle natively
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            setOutlineProvider(new ViewOutlineProvider() {
                @Override
                public void getOutline(View view, Outline outline) {
                    outline.setOval(0, 0, view.getWidth(), view.getHeight());
                }
            });
            setClipToOutline(true);
        }

        // ── Camera preview ────────────────────────────────────────────────────
        mPreviewView = new PreviewView(getContext());
        mPreviewView.setImplementationMode(PreviewView.ImplementationMode.PERFORMANCE);
        mPreviewView.setLayoutParams(
            new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        );
        addView(mPreviewView);

        // ── ML Kit face detector ──────────────────────────────────────────────
        FaceDetectorOptions options = new FaceDetectorOptions.Builder()
            .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_FAST)
            .setLandmarkMode(FaceDetectorOptions.LANDMARK_MODE_NONE)
            .setClassificationMode(FaceDetectorOptions.CLASSIFICATION_MODE_NONE)
            .setMinFaceSize(0.15f)
            .enableTracking()
            .build();
        mFaceDetector = FaceDetection.getClient(options);

        // ── Background thread for image analysis ──────────────────────────────
        mCameraExecutor = Executors.newSingleThreadExecutor();

        // ── Paint setup ───────────────────────────────────────────────────────
        mBoxPaint.setStyle(Paint.Style.STROKE);
        mBoxPaint.setStrokeWidth(6f);
        mBoxPaint.setAntiAlias(true);

        mLabelPaint.setTextSize(36f);
        mLabelPaint.setAntiAlias(true);
        mLabelPaint.setFakeBoldText(true);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Public API (called by ViewManager when React props change)
    // ─────────────────────────────────────────────────────────────────────────

    public void setRole(String role) {
        mRole = (role != null) ? role : "family";
        invalidate();
    }

    /** Called by ViewManager after the view is attached to the window */
    public void startCamera() {
        if (mCameraStarted) {
            return;
        }
        if (getWidth() == 0 || getHeight() == 0) {
            Log.d("FaceCameraView", "startCamera: View size is 0x0, waiting for layout.");
            return;
        }

        Context ctx = getContext();

        // Runtime permission check
        if (ContextCompat.checkSelfPermission(ctx, Manifest.permission.CAMERA)
                != PackageManager.PERMISSION_GRANTED) {
            return;
        }

        mCameraStarted = true;
        Log.d("FaceCameraView", "startCamera: Starting CameraX with size " + getWidth() + "x" + getHeight());

        ListenableFuture<ProcessCameraProvider> future =
            ProcessCameraProvider.getInstance(ctx);

        future.addListener(() -> {
            try {
                ProcessCameraProvider provider = future.get();
                bindCameraUseCases(provider);
            } catch (Exception e) {
                mCameraStarted = false;
                e.printStackTrace();
            }
        }, ContextCompat.getMainExecutor(ctx));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CameraX setup
    // ─────────────────────────────────────────────────────────────────────────

    private void bindCameraUseCases(ProcessCameraProvider provider) {
        // Dynamic camera selection: try back camera, fallback to front camera if not available
        CameraSelector cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA;
        try {
            if (provider.hasCamera(CameraSelector.DEFAULT_BACK_CAMERA)) {
                Log.d("FaceCameraView", "Back camera found and selected.");
                cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA;
            } else if (provider.hasCamera(CameraSelector.DEFAULT_FRONT_CAMERA)) {
                Log.w("FaceCameraView", "Back camera not available, falling back to Front camera.");
                cameraSelector = CameraSelector.DEFAULT_FRONT_CAMERA;
            } else {
                Log.e("FaceCameraView", "No camera available on this device.");
            }
        } catch (Exception e) {
            Log.e("FaceCameraView", "Error checking camera availability: " + e.getMessage());
            cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA;
        }

        // ── Preview use case ──────────────────────────────────────────────────
        Preview preview = new Preview.Builder().build();
        preview.setSurfaceProvider(mPreviewView.getSurfaceProvider());

        // ── Image analysis use case ───────────────────────────────────────────
        ImageAnalysis imageAnalysis = new ImageAnalysis.Builder()
            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
            .build();

        imageAnalysis.setAnalyzer(mCameraExecutor, imageProxy -> analyzeFrame(imageProxy));

        // ── Bind to lifecycle ─────────────────────────────────────────────────
        provider.unbindAll();
        try {
            mCamera = provider.bindToLifecycle(
                this,
                cameraSelector,
                preview,
                imageAnalysis
            );
            Log.d("FaceCameraView", "Camera successfully bound to native view lifecycle.");
        } catch (Exception e) {
            Log.e("FaceCameraView", "Error binding camera to native view lifecycle: " + e.getMessage() + ". Trying fallback to Back Camera...");
            try {
                cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA;
                mCamera = provider.bindToLifecycle(
                    this,
                    cameraSelector,
                    preview,
                    imageAnalysis
                );
                Log.d("FaceCameraView", "Fallback: Camera successfully bound to Back camera.");
            } catch (Exception ex) {
                Log.e("FaceCameraView", "Error binding fallback back camera: " + ex.getMessage());
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ML Kit image analysis
    // ─────────────────────────────────────────────────────────────────────────

    @OptIn(markerClass = ExperimentalGetImage.class)
    private void analyzeFrame(ImageProxy imageProxy) {
        if (imageProxy.getImage() == null) {
            imageProxy.close();
            return;
        }

        InputImage inputImage = InputImage.fromMediaImage(
            imageProxy.getImage(),
            imageProxy.getImageInfo().getRotationDegrees()
        );

        // Store frame dimensions for coordinate mapping
        mPreviewWidth  = imageProxy.getWidth();
        mPreviewHeight = imageProxy.getHeight();

        mFaceDetector.process(inputImage)
            .addOnSuccessListener(faces -> {
                updateFaceBounds(faces, imageProxy);
                imageProxy.close();
            })
            .addOnFailureListener(e -> {
                imageProxy.close();
            });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Map ML Kit face bounds → view coordinates and redraw
    // ─────────────────────────────────────────────────────────────────────────

    private void updateFaceBounds(List<Face> faces, ImageProxy proxy) {
        List<RectF> newBounds = new ArrayList<>();

        float scaleX = (float) getWidth()  / (float) proxy.getHeight(); // rotated
        float scaleY = (float) getHeight() / (float) proxy.getWidth();

        for (Face face : faces) {
            android.graphics.Rect r = face.getBoundingBox();

            // Mirror X for front camera
            float left  = getWidth()  - r.right  * scaleX;
            float right = getWidth()  - r.left   * scaleX;
            float top   = r.top      * scaleY;
            float bottom = r.bottom  * scaleY;

            newBounds.add(new RectF(left, top, right, bottom));
        }

        boolean wasDetected = mFaceDetected;
        mFaceDetected = !faces.isEmpty();
        mFaceBounds   = newBounds;

        // Redraw bounding boxes on UI thread
        post(this::invalidate);

        // Fire React Native event only when detection state changes
        if (mFaceDetected != wasDetected) {
            sendFaceDetectedEvent(mFaceDetected);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Draw bounding boxes on canvas
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        mBoxPaint.setColor(getRoleColor());
        mLabelPaint.setColor(getRoleColor());

        for (int i = 0; i < mFaceBounds.size(); i++) {
            RectF rect = mFaceBounds.get(i);
            // Draw bounding rectangle
            canvas.drawRoundRect(rect, 16f, 16f, mBoxPaint);

            // Draw label above the box
            String label = getRoleLabel(i);
            canvas.drawText(label, rect.left + 8f, rect.top - 12f, mLabelPaint);
        }
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        int width = MeasureSpec.getSize(widthMeasureSpec);
        int height = MeasureSpec.getSize(heightMeasureSpec);
        int exactWidthSpec = MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY);
        int exactHeightSpec = MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY);
        for (int i = 0; i < getChildCount(); i++) {
            getChildAt(i).measure(exactWidthSpec, exactHeightSpec);
        }
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        super.onLayout(changed, left, top, right, bottom);
        int width = right - left;
        int height = bottom - top;
        for (int i = 0; i < getChildCount(); i++) {
            getChildAt(i).layout(0, 0, width, height);
        }
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            invalidateOutline();
        }
        if (width > 0 && height > 0) {
            startCamera();
        }
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            invalidateOutline();
        }
        if (w > 0 && h > 0) {
            startCamera();
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Role colour / label helpers
    // ─────────────────────────────────────────────────────────────────────────

    private int getRoleColor() {
        switch (mRole) {
            case ROLE_CHILD:  return Color.parseColor("#A78BFA"); // purple
            case ROLE_PARENT: return Color.parseColor("#38BDF8"); // blue
            default:          return Color.parseColor("#22D3EE"); // cyan (family)
        }
    }

    private String getRoleLabel(int index) {
        switch (mRole) {
            case ROLE_CHILD:  return "Child";
            case ROLE_PARENT: return "Parent";
            default:          return index == 0 ? "Member " + (index + 1) : "Member " + (index + 1);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Send event to React Native JS layer
    // ─────────────────────────────────────────────────────────────────────────

    private void sendFaceDetectedEvent(boolean detected) {
        ReactContext reactContext = (ReactContext) getContext();
        WritableMap event = Arguments.createMap();
        event.putBoolean("detected", detected);
        event.putInt("faceCount", mFaceBounds.size());
        event.putString("role", mRole);

        reactContext.getJSModule(RCTEventEmitter.class)
            .receiveEvent(getId(), "onFaceDetected", event);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Lifecycle: start camera when attached, release when detached
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        // Re-init executor if it was shut down (e.g. view reused)
        if (mCameraExecutor == null || mCameraExecutor.isShutdown()) {
            mCameraExecutor = Executors.newSingleThreadExecutor();
        }
        mLifecycleRegistry.setCurrentState(Lifecycle.State.RESUMED);
        startCamera();
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        mLifecycleRegistry.setCurrentState(Lifecycle.State.CREATED);
        if (mCameraExecutor != null && !mCameraExecutor.isShutdown()) {
            mCameraExecutor.shutdown();
        }
        if (mFaceDetector != null) {
            mFaceDetector.close();
        }
        mCameraStarted = false;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // LifecycleOwner and LifecycleEventListener implementations
    // ─────────────────────────────────────────────────────────────────────────

    @NonNull
    @Override
    public Lifecycle getLifecycle() {
        return mLifecycleRegistry;
    }

    @Override
    public void onHostResume() {
        mLifecycleRegistry.setCurrentState(Lifecycle.State.RESUMED);
    }

    @Override
    public void onHostPause() {
        mLifecycleRegistry.setCurrentState(Lifecycle.State.STARTED);
    }

    @Override
    public void onHostDestroy() {
        mLifecycleRegistry.setCurrentState(Lifecycle.State.DESTROYED);
        if (getContext() instanceof ReactContext) {
            ((ReactContext) getContext()).removeLifecycleEventListener(this);
        } else if (getContext() instanceof android.content.ContextWrapper) {
            Context baseCtx = ((android.content.ContextWrapper) getContext()).getBaseContext();
            if (baseCtx instanceof ReactContext) {
                ((ReactContext) baseCtx).removeLifecycleEventListener(this);
            }
        }
    }
}
